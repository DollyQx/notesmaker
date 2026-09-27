import { NextRequest, NextResponse } from 'next/server';
import { requireStudentOrAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const auth = await requireStudentOrAdmin(request);
  if (auth.errorResponse || !auth.user) return auth.errorResponse!;

  try {
    const body = await request.json();
    const { noteId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!noteId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing required payment verification parameters' },
        { status: 400 }
      );
    }

    const studentId = auth.user.userId;

    // SECURITY: Always fetch actual note from DB
    const note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note) {
      return NextResponse.json(
        { success: false, error: 'Note document not found' },
        { status: 404 }
      );
    }

    const keySecret =
      process.env.RAZORPAY_KEY_SECRET ||
      process.env.RAZORPAY_SECRET ||
      '';

    if (!keySecret) {
      console.error('Razorpay secret missing from server configuration');
      return NextResponse.json(
        { success: false, error: 'Payment gateway configuration error' },
        { status: 500 }
      );
    }

    // Server-side HMAC SHA256 Signature Verification
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.warn(`Payment signature mismatch for order ${razorpay_order_id}`);
      return NextResponse.json(
        { success: false, error: 'Payment signature verification failed. Access denied.' },
        { status: 400 }
      );
    }

    // PREVENT DUPLICATES: Check if student has already completed purchase for this note
    const existingPurchase = await prisma.purchase.findFirst({
      where: { studentId, noteId }
    });

    let purchaseRecord;

    if (existingPurchase) {
      if (existingPurchase.paymentStatus === 'COMPLETED') {
        return NextResponse.json({
          success: true,
          message: 'Note is already unlocked in your library',
          purchase: existingPurchase
        });
      }

      purchaseRecord = await prisma.purchase.update({
        where: { id: existingPurchase.id },
        data: {
          paymentStatus: 'COMPLETED',
          paymentReference: razorpay_payment_id,
          amount: note.price
        }
      });
    } else {
      purchaseRecord = await prisma.purchase.create({
        data: {
          transactionId: razorpay_payment_id,
          studentId,
          noteId,
          amount: note.price,
          paymentStatus: 'COMPLETED',
          paymentReference: razorpay_payment_id,
          paymentMethod: 'Razorpay Online'
        }
      });

      // Increment note sales count safely
      await prisma.note.update({
        where: { id: noteId },
        data: { salesCount: { increment: 1 } }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully! Note document unlocked.',
      purchase: purchaseRecord
    });
  } catch (error: any) {
    console.error('Razorpay Verify API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment signature' },
      { status: 500 }
    );
  }
}
