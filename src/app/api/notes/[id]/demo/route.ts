import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        subCategory: { select: { id: true, name: true } }
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
        { success: false, error: 'Document not available' },
        { status: 404 }
      );
    }

    if (!note.demoEnabled) {
      return NextResponse.json(
        { success: false, error: 'Demo / Preview is not enabled for this note' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        id: note.id,
        title: note.title,
        author: note.author,
        institute: note.institute,
        pages: note.pages,
        categoryName: note.category?.name || 'General',
        subCategoryName: note.subCategory?.name || 'General',
        contentType: note.contentType,
        demoEnabled: true,
        demoContent: note.demoContent,
        hasDemoPdf: !!note.demoPdfUrl,
        demoPdfUrl: note.demoPdfUrl ? `/api/notes/${note.id}/demo-pdf` : null
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=60',
          'X-NotesStudy-Security': 'Demo-Preview-Authorized'
        }
      }
    );
  } catch (error) {
    console.error('Note Demo API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error retrieving demo preview' },
      { status: 500 }
    );
  }
}
