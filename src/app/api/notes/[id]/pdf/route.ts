import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Access to protected PDF requires authentication' },
        { status: 401 }
      );
    }

    const note = await prisma.note.findUnique({ where: { id } });
    if (!note) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    // Admins can read all documents. Students must have purchased the note.
    if (user.role !== 'ADMIN') {
      const hasPurchased = await prisma.purchase.findFirst({
        where: { studentId: user.userId, noteId: id }
      });

      if (!hasPurchased) {
        return NextResponse.json(
          { success: false, error: 'Forbidden: You must purchase this note before opening the PDF reader' },
          { status: 403 }
        );
      }
    }

    // Stream simulated binary PDF buffer with inline headers (disables save-as attachment header)
    const pdfTextContent = `%PDF-1.7
1 0 obj
<<
  /Title (${note.title})
  /Author (${note.author})
  /Subject (${note.description})
  /Producer (NotesMaker Secure Engine)
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
<< /Length 200 >>
stream
BT
/F1 24 Tf
100 700 Td
(${note.title}) Tj
0 -40 Td
/F1 14 Tf
(Unlocked for: ${user.name} - ${user.email}) Tj
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

    const encoder = new TextEncoder();
    const pdfUint8 = encoder.encode(pdfTextContent);

    return new NextResponse(pdfUint8, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${note.slug}.pdf"`,
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
        'X-NotesMaker-Security': 'Protected-Viewer'
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to stream secure PDF document' }, { status: 500 });
  }
}
