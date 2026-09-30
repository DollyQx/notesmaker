import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import { prisma } from '@/lib/db';
import { resolvePdfFilePath } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const note = await prisma.note.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        demoEnabled: true,
        demoPdfUrl: true
      }
    });

    if (!note) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    if (note.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: 'Document not available or unlisted' },
        { status: 404 }
      );
    }

    if (!note.demoEnabled || !note.demoPdfUrl) {
      return NextResponse.json(
        { success: false, error: 'Demo PDF preview is not enabled for this note' },
        { status: 404 }
      );
    }

    // Stream ONLY the demo/sample PDF from protected server storage
    const resolvedPath = resolvePdfFilePath(note.demoPdfUrl);
    if (!resolvedPath || !fs.existsSync(resolvedPath)) {
      return NextResponse.json(
        { success: false, error: 'Demo PDF file is not available on server storage' },
        { status: 404 }
      );
    }

    const fileBuffer = await fs.promises.readFile(resolvedPath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="sample-${note.slug || 'preview'}.pdf"`,
        'Cache-Control': 'public, max-age=300',
        'X-Content-Type-Options': 'nosniff',
        'X-NotesStudy-Security': 'Demo-Preview-Only'
      }
    });
  } catch (error: any) {
    console.error('Demo PDF Stream Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to stream sample PDF preview' },
      { status: 500 }
    );
  }
}
