import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdmin, getAuthUser } from '@/lib/auth';
import { deletePdfFromStorage } from '@/lib/storage';

const updateNoteSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  originalPrice: z.number().optional(),
  categoryId: z.string().optional(),
  subCategoryId: z.string().optional(),
  author: z.string().optional(),
  institute: z.string().optional(),
  pages: z.number().optional(),
  fileSize: z.string().optional(),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).optional(),
  featured: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  pdfUrl: z.string().optional()
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser(request);
    const isAdmin = user?.role === 'ADMIN';

    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        subCategory: { select: { id: true, name: true, slug: true } }
      }
    });

    if (!note) {
      return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
    }

    // CRITICAL SECURITY RULE: Deny student access to unpublished notes
    if (!isAdmin && note.status !== 'ACTIVE') {
      return NextResponse.json({ success: false, error: 'Note not found or unavailable' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      note: {
        ...note,
        categoryName: note.category?.name || 'General',
        subCategoryName: note.subCategory?.name || 'General'
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch note' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { id } = await params;
    const body = await request.json();
    const result = updateNoteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }

    const updated = await prisma.note.update({
      where: { id },
      data: result.data
    });

    return NextResponse.json({ success: true, note: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { id } = await params;

    const note = await prisma.note.findUnique({ where: { id } });
    if (note && note.pdfUrl) {
      // Clean up private Supabase Storage object
      await deletePdfFromStorage(note.pdfUrl);
    }

    await prisma.note.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Note deleted and storage cleaned up' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to delete note' }, { status: 500 });
  }
}
