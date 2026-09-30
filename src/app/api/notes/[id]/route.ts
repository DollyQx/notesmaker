import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdmin, getAuthUser } from '@/lib/auth';
import { deletePdfFromStorage } from '@/lib/storage';
import { sanitizeTextContent } from '@/lib/sanitize';

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
  pdfUrl: z.string().optional(),
  contentType: z.enum(['PDF', 'TEXT']).optional(),
  textContent: z.string().optional(),
  demoEnabled: z.boolean().optional(),
  demoContent: z.string().optional(),
  demoPdfUrl: z.string().optional()
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

    // Verify whether the requesting student has purchased this note
    let hasPurchased = false;
    if (user && !isAdmin) {
      const purchase = await prisma.purchase.findFirst({
        where: {
          studentId: user.userId,
          noteId: id,
          paymentStatus: 'COMPLETED'
        }
      });
      hasPurchased = !!purchase;
    }

    const isAuthorized = isAdmin || hasPurchased;

    // CRITICAL SECURITY RULE: Deny unauthenticated or unpurchased access to unlisted/draft notes
    if (!isAuthorized && note.status !== 'ACTIVE') {
      return NextResponse.json({ success: false, error: 'Note not found or unavailable' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      note: {
        ...note,
        textContent: isAuthorized ? note.textContent : null,
        demoEnabled: !!note.demoEnabled,
        demoContent: (note.demoEnabled || isAuthorized) ? note.demoContent : null,
        demoPdfUrl: note.demoPdfUrl ? (note.demoEnabled ? `/api/notes/${note.id}/demo-pdf` : (isAdmin ? note.demoPdfUrl : null)) : null,
        hasDemoPdf: !!note.demoPdfUrl,
        isUnlocked: isAuthorized,
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

    const updateData: any = { ...result.data };

    if (updateData.demoContent !== undefined && updateData.demoContent !== null) {
      updateData.demoContent = sanitizeTextContent(updateData.demoContent);
    }

    if (updateData.textContent !== undefined && updateData.textContent !== null) {
      const sanitized = sanitizeTextContent(updateData.textContent);
      if (updateData.contentType === 'TEXT' && (!sanitized || !sanitized.trim())) {
        return NextResponse.json(
          { success: false, error: 'Valid educational text content is required for Text notes' },
          { status: 400 }
        );
      }
      updateData.textContent = sanitized;

      if (updateData.contentType === 'TEXT') {
        const wordCount = sanitized.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;
        if (!updateData.pages) {
          updateData.pages = Math.max(1, Math.ceil(wordCount / 250));
        }
        updateData.fileSize = `${Math.max(1, Math.round(wordCount * 0.005))} KB Text Document`;
      }
    }

    // Safe Content-Type Switching:
    // If switching from PDF to TEXT, ensure text content is provided
    if (updateData.contentType === 'TEXT' && updateData.textContent === undefined) {
      const existing = await prisma.note.findUnique({ where: { id }, select: { textContent: true } });
      if (!existing?.textContent || !existing.textContent.trim()) {
        return NextResponse.json(
          { success: false, error: 'Please provide educational text content before switching note type to TEXT' },
          { status: 400 }
        );
      }
    }

    // If switching from TEXT to PDF, ensure PDF URL is present
    if (updateData.contentType === 'PDF' && updateData.pdfUrl === undefined) {
      const existing = await prisma.note.findUnique({ where: { id }, select: { pdfUrl: true } });
      if (!existing?.pdfUrl) {
        return NextResponse.json(
          { success: false, error: 'Please upload a PDF document before switching note type to PDF' },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.note.update({
      where: { id },
      data: updateData
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

    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        _count: {
          select: { purchases: true }
        }
      }
    });

    if (!note) {
      return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
    }

    // PRESERVE PURCHASE HISTORY:
    // If note has existing student purchases, archive it instead of hard deleting.
    // This removes the note from public store while preserving financial transactions and student library access.
    if (note._count.purchases > 0) {
      await prisma.note.update({
        where: { id },
        data: { status: 'ARCHIVED' }
      });

      return NextResponse.json({
        success: true,
        archived: true,
        message: `Note has ${note._count.purchases} student purchase(s). It has been ARCHIVED to preserve student library access and financial history.`
      });
    }

    // Clean up persistent storage objects when hard deleting an unpurchased note
    if (note.pdfUrl) {
      await deletePdfFromStorage(note.pdfUrl);
    }
    if (note.demoPdfUrl) {
      await deletePdfFromStorage(note.demoPdfUrl);
    }

    await prisma.note.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Note deleted and storage cleaned up' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to delete note' }, { status: 500 });
  }
}
