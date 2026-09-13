import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

const updateSubSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  categoryId: z.string().optional(),
  description: z.string().optional()
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { id } = await params;
    const body = await request.json();
    const result = updateSubSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }

    const { name, categoryId, description } = result.data;
    const updateData: any = {};

    if (name) {
      updateData.name = name.trim();
      updateData.slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (categoryId) updateData.categoryId = categoryId;
    if (description !== undefined) updateData.description = description;

    const updated = await prisma.subCategory.update({
      where: { id },
      data: updateData,
      include: { category: true }
    });

    return NextResponse.json({ success: true, subCategory: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to update sub-category' }, { status: 500 });
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
    await prisma.subCategory.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Sub-category deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to delete sub-category' }, { status: 500 });
  }
}
