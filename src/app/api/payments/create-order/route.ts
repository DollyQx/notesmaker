import { NextRequest, NextResponse } from 'next/server';
import { requireStudentOrAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
  const auth = await requireStudentOrAdmin(request);
  if (auth.errorResponse || !auth.user) return auth.errorResponse!;

  try {
    const body = await request.json();
    const { noteId } = body;

    if (!noteId) {
      return NextResponse.json(
        { success: false, error: 'Note ID is required' },
        { status: 400 }
      );
    }

    // SECURITY: Always fetch actual note price from database
    const note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    if (note.status !== 'ACTIVE' && auth.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Note is not currently available for purchase' },
        { status: 400 }
      );
    }

    const studentId = auth.user.userId;

    // Check if student already purchased this note
    const existingPurchase = await prisma.purchase.findFirst({
      where: { studentId, noteId, paymentStatus: 'COMPLETED' }
    });

    if (existingPurchase) {
      return NextResponse.json({
        success: true,
        alreadyPurchased: true,
        message: 'You have already unlocked this note document',
        purchase: existingPurchase
      });
    }

    const keyId =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY ||
      '';
    const keySecret =
      process.env.RAZORPAY_KEY_SECRET ||
      process.env.RAZORPAY_SECRET ||
      '';

    if (!keyId || !keySecret) {
      console.error('Razorpay gateway credentials missing from environment variables');
      return NextResponse.json(
        { success: false, error: 'Payment gateway configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    const amountInPaise = Math.round(note.price * 100);

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    const receiptId = `rcpt_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      notes: {
        noteId: note.id,
        studentId,
        noteTitle: note.title.slice(0, 40)
      }
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      keyId,
      amount: note.price,
      amountInPaise,
      currency: 'INR',
      noteTitle: note.title,
      studentName: auth.user.name,
      studentEmail: auth.user.email
    });
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
