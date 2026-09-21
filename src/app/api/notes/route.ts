import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdmin, getAuthUser } from '@/lib/auth';

const noteSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(5, 'Description is required'),
  price: z.number().min(0, 'Price must be non-negative'),
  originalPrice: z.number().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  subCategoryId: z.string().min(1, 'Sub-Category is required'),
  author: z.string().default('Topper Contributor'),
  institute: z.string().optional(),
  pages: z.number().default(50),
  fileSize: z.string().default('10 MB'),
  pdfUrl: z.string().optional(),
  thumbnail: z.string().optional(),
  sampleText: z.string().optional(),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).default('ACTIVE'),
  featured: z.boolean().default(false),
  isBestseller: z.boolean().default(false)
});

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const isAdmin = user?.role === 'ADMIN';

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const search = searchParams.get('search');
    const statusParam = searchParams.get('status');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort'); // 'newest' | 'price_asc' | 'price_desc' | 'popular'

    const where: any = {};

    // CRITICAL SECURITY RULE: Non-admins CANNOT see unpublished notes under any circumstances
    if (!isAdmin) {
      where.status = 'ACTIVE';
    } else if (statusParam) {
      where.status = statusParam;
    }

    if (category) where.categoryId = category;
    if (subcategory) where.subCategoryId = subcategory;

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { author: { contains: search } },
        { institute: { contains: search } }
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'popular') {
      orderBy = { salesCount: 'desc' };
    }

    const notes = await prisma.note.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        subCategory: { select: { id: true, name: true, slug: true } }
      },
      orderBy
    });

    const formatted = notes.map((n: any) => ({
      id: n.id,
      title: n.title,
      slug: n.slug,
      description: n.description,
      price: n.price,
      originalPrice: n.originalPrice,
      pdfUrl: n.pdfUrl,
      thumbnail: n.thumbnail,
      categoryId: n.categoryId,
      categoryName: n.category?.name || 'General',
      subCategoryId: n.subCategoryId,
      subCategoryName: n.subCategory?.name || 'General',
      author: n.author,
      institute: n.institute,
      pages: n.pages,
      fileSize: n.fileSize,
      sampleText: n.sampleText,
      status: n.status,
      isBestseller: n.isBestseller,
      featured: n.featured,
      salesCount: n.salesCount,
      rating: n.rating,
      createdAt: n.createdAt.toISOString()
    }));

    return NextResponse.json({ success: true, notes: formatted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await request.json();
    const result = noteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0]?.message || 'Invalid note data' },
        { status: 400 }
      );
    }

    const data = result.data;
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const note = await prisma.note.create({
      data: {
        title: data.title.trim(),
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        description: data.description.trim(),
        price: data.price,
        originalPrice: data.originalPrice,
        pdfUrl: data.pdfUrl || `/api/notes/note-demo/pdf`,
        thumbnail: data.thumbnail,
        categoryId: data.categoryId,
        subCategoryId: data.subCategoryId,
        author: data.author.trim(),
        institute: data.institute?.trim(),
        pages: data.pages,
        fileSize: data.fileSize,
        sampleText: data.sampleText,
        status: data.status,
        featured: data.featured,
        isBestseller: data.isBestseller
      },
      include: {
        category: true,
        subCategory: true
      }
    });

    return NextResponse.json({ success: true, note }, { status: 201 });
  } catch (error: any) {
    console.error('Create Note API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to publish note' }, { status: 500 });
  }
}
