import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

const subCategorySchema = z.object({
  name: z.string().min(2, 'Sub-Category name must be at least 2 characters'),
  categoryId: z.string().min(1, 'Parent category is required'),
  description: z.string().optional()
});

export async function GET() {
  try {
    const subCategories = await prisma.subCategory.findMany({
      include: {
        category: { select: { id: true, name: true } },
        _count: { select: { notes: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = subCategories.map((s: any) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      categoryId: s.categoryId,
      categoryName: s.category?.name || 'General',
      description: s.description || '',
      noteCount: s._count.notes
    }));

    return NextResponse.json({ success: true, subcategories: formatted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch sub-categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await request.json();
    const result = subCategorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0]?.message || 'Invalid subcategory data' },
        { status: 400 }
      );
    }

    const { name, categoryId, description } = result.data;
    const cleanName = name.trim();
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const subCategory = await prisma.subCategory.create({
      data: {
        name: cleanName,
        slug,
        categoryId,
        description
      },
      include: {
        category: { select: { id: true, name: true } }
      }
    });

    return NextResponse.json({
      success: true,
      subCategory: {
        id: subCategory.id,
        name: subCategory.name,
        slug: subCategory.slug,
        categoryId: subCategory.categoryId,
        categoryName: subCategory.category?.name || 'General',
        description: subCategory.description
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create SubCategory Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create sub-category' }, { status: 500 });
  }
}
