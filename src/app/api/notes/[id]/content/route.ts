import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
        { success: false, error: 'Unauthorized: Authentication required to access protected study note' },
        { status: 401 }
      );
    }

    // STEP 2: Verify Note Exists in Database
    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        category: { select: { name: true } },
        subCategory: { select: { name: true } }
      }
    });

    if (!note) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    // STEP 3: Verify Student Purchase or Admin Authorization
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
          { success: false, error: 'Forbidden: You must purchase this note before accessing the text content' },
          { status: 403 }
        );
      }
    }

    // STEP 4: Verify Content Type is TEXT
    if (note.contentType !== 'TEXT') {
      return NextResponse.json(
        { success: false, error: 'Requested document is not a text note' },
        { status: 400 }
      );
    }

    // STEP 6: Return Protected Content
    return NextResponse.json(
      {
        success: true,
        id: note.id,
        title: note.title,
        author: note.author,
        categoryName: note.category?.name || 'General',
        subCategoryName: note.subCategory?.name || 'General',
        pages: note.pages,
        textContent: note.textContent,
        updatedAt: note.updatedAt.toISOString()
      },
      {
        headers: {
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Content-Type-Options': 'nosniff',
          'X-NotesStudy-Security': 'Protected-Viewer-Enforced'
        }
      }
    );
  } catch (error) {
    console.error('Protected Note Content API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error retrieving document' },
      { status: 500 }
    );
  }
}
