import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireStudentOrAdmin } from '@/lib/auth';

const purchaseSchema = z.object({
  noteId: z.string().min(1, 'Note ID is required'),
  targetStudentId: z.string().optional() // Only allowed when called by ADMIN
});

export async function POST(request: NextRequest) {
  const auth = await requireStudentOrAdmin(request);
  if (auth.errorResponse || !auth.user) return auth.errorResponse!;

  // SECURITY: Normal students must complete purchases through Razorpay payment verification
  if (auth.user.role !== 'ADMIN') {
    return NextResponse.json(
      {
        success: false,
        error: 'Direct purchase bypass is disabled. All student purchases must be completed through Razorpay checkout.'
      },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const result = purchaseSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0]?.message || 'Invalid note ID' },
        { status: 400 }
      );
    }

    const { noteId, targetStudentId } = result.data;
    const recipientStudentId = targetStudentId || auth.user.userId;

    const note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note) {
      return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
    }

    // Check if student already has this note
    const existing = await prisma.purchase.findFirst({
      where: { studentId: recipientStudentId, noteId }
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Note is already unlocked for this student',
        purchase: existing
      });
    }

    const txnId = `ADMIN-GRANT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPurchase = await prisma.purchase.create({
      data: {
        transactionId: txnId,
        studentId: recipientStudentId,
        noteId,
        amount: note.price,
        paymentStatus: 'COMPLETED',
        paymentReference: `MANUAL_ADMIN_${auth.user.email}`,
        paymentMethod: 'Admin Manual Grant'
      }
    });

    // Increment sales count
    await prisma.note.update({
      where: { id: noteId },
      data: { salesCount: { increment: 1 } }
    });

    return NextResponse.json({
      success: true,
      message: 'Note document successfully granted by administrator',
      purchase: newPurchase
    });
  } catch (error: any) {
    console.error('Purchase Grant API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process purchase grant' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireStudentOrAdmin(request);
  if (auth.errorResponse || !auth.user) return auth.errorResponse!;

  try {
    const studentId = auth.user.userId;

    const purchases = await prisma.purchase.findMany({
      where: { studentId, paymentStatus: 'COMPLETED' },
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
