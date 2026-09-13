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

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_notesmaker123';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'notesmaker_secret_123';
    const amountInPaise = Math.round(note.price * 100);

    let orderId = `order_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // If Razorpay SDK can connect with valid credentials
    if (keyId.startsWith('rzp_live_') || (keyId.startsWith('rzp_test_') && !keyId.includes('placeholder'))) {
      try {
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret
        });

        const order = await razorpay.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          notes: {
            noteId: note.id,
            studentId,
            noteTitle: note.title
          }
        });
        if (order && order.id) {
          orderId = order.id;
        }
      } catch (rzpErr) {
        console.warn('Razorpay SDK Order creation fallback to mock order ID:', rzpErr);
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
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
      { success: false, error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
