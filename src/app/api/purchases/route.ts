import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireStudentOrAdmin } from '@/lib/auth';

const purchaseSchema = z.object({
  noteId: z.string().min(1, 'Note ID is required')
});

export async function POST(request: NextRequest) {
  const auth = await requireStudentOrAdmin(request);
  if (auth.errorResponse || !auth.user) return auth.errorResponse!;

  try {
    const body = await request.json();
    const result = purchaseSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.issues[0]?.message || 'Invalid note ID' }, { status: 400 });
    }

    const { noteId } = result.data;
    const studentId = auth.user.userId;

    const note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note) {
      return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
    }

    // Check if already purchased
    const existing = await prisma.purchase.findFirst({
      where: { studentId, noteId }
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Note is already unlocked in your library',
        purchase: existing
      });
    }

    const txnId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPurchase = await prisma.purchase.create({
      data: {
        transactionId: txnId,
        studentId,
        noteId,
        amount: note.price,
        paymentStatus: 'COMPLETED',
        paymentReference: txnId,
        paymentMethod: 'Instant Demo Unlock'
      }
    });

    // Increment sales count
    await prisma.note.update({
      where: { id: noteId },
      data: { salesCount: { increment: 1 } }
    });

    return NextResponse.json({
      success: true,
      message: 'Note unlocked successfully!',
      purchase: newPurchase
    });
  } catch (error: any) {
    console.error('Purchase API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process purchase' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireStudentOrAdmin(request);
  if (auth.errorResponse || !auth.user) return auth.errorResponse!;

  try {
    const studentId = auth.user.userId;

    const purchases = await prisma.purchase.findMany({
      where: { studentId },
      include: {
        note: {
          include: { category: true, subCategory: true }
        }
      },
      orderBy: { purchasedAt: 'desc' }
    });

    const noteIds = purchases.map((p: any) => p.noteId);

    return NextResponse.json({
      success: true,
      purchasedNoteIds: noteIds,
      purchases
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch student library' }, { status: 500 });
  }
}
