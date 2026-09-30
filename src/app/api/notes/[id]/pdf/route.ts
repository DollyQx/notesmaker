import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { resolvePdfFilePath } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // STEP 1: Verify Student Authentication
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required to access protected PDF' },
        { status: 401 }
      );
    }

    // STEP 2: Verify Requested Note Exists in Database
    const note = await prisma.note.findUnique({ where: { id } });
    if (!note) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    // STEP 3: Verify Student Purchase or Admin Authorization
    // Admins bypass purchase check; verified students retain access even if note is unlisted/archived
    if (user.role !== 'ADMIN') {
      const purchase = await prisma.purchase.findFirst({
        where: {
          studentId: user.userId,
          noteId: id,
          paymentStatus: 'COMPLETED'
        }
      });

      if (!purchase) {
        if (note.status !== 'ACTIVE') {
          return NextResponse.json(
            { success: false, error: 'Document not found or unavailable' },
            { status: 404 }
          );
        }
        return NextResponse.json(
          { success: false, error: 'Forbidden: You must purchase this note before accessing the PDF document' },
          { status: 403 }
        );
      }
    }

    // STEP 5: Stream Real PDF Document from Persistent Protected Storage
    if (note.pdfUrl) {
      const resolvedPath = resolvePdfFilePath(note.pdfUrl);
      if (resolvedPath && fs.existsSync(resolvedPath)) {
        const fileBuffer = await fs.promises.readFile(resolvedPath);
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${note.slug || 'document'}.pdf"`,
            'Cache-Control': 'private, no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'X-Content-Type-Options': 'nosniff',
            'X-NotesStudy-Security': 'Protected-Viewer-Enforced'
          }
        });
      }
    }

    // Fallback: Generate dynamic licensed PDF placeholder if uploaded file is pending
    const pdfTextContent = `%PDF-1.7
1 0 obj
<<
  /Title (${note.title.replace(/[()]/g, '')})
  /Author (${note.author.replace(/[()]/g, '')})
  /Subject (${note.description.slice(0, 100).replace(/[()]/g, '')})
  /Producer (Notes Study Secure Engine)
>>
endobj
2 0 obj
<<
  /Type /Catalog
  /Pages 3 0 R
>>
endobj
3 0 obj
<<
  /Type /Pages
  /Kids [4 0 R]
  /Count 1
>>
endobj
4 0 obj
<<
  /Type /Page
  /Parent 3 0 R
  /Resources << >>
  /MediaBox [0 0 612 792]
  /Contents 5 0 R
>>
endobj
5 0 obj
<< /Length 250 >>
stream
BT
/F1 24 Tf
100 700 Td
(${note.title.slice(0, 40).replace(/[()]/g, '')}) Tj
0 -40 Td
/F1 14 Tf
(Licensed to: ${user.name.replace(/[()]/g, '')} - ${user.email.replace(/[()]/g, '')}) Tj
0 -30 Td
(Notes Study Official License) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000140 00000 n
0000000195 00000 n
0000000258 00000 n
0000000360 00000 n
trailer
<<
  /Size 6
  /Root 2 0 R
>>
startxref
580
%%EOF`;

    const pdfUint8 = new TextEncoder().encode(pdfTextContent);

    return new NextResponse(pdfUint8, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${note.slug || 'document'}.pdf"`,
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Content-Type-Options': 'nosniff',
        'X-NotesStudy-Security': 'Protected-Viewer-Enforced'
      }
    });
  } catch (error: any) {
    console.error('PDF Access Stream Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to stream secure PDF document' },
      { status: 500 }
    );
  }
}
