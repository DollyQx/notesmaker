import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const purchases = await prisma.purchase.findMany({
      where: search
        ? {
            OR: [
              { transactionId: { contains: search } },
              { student: { name: { contains: search } } },
              { student: { email: { contains: search } } },
              { note: { title: { contains: search } } }
            ]
          }
        : {},
      include: {
        student: { select: { id: true, name: true, email: true } },
        note: { select: { id: true, title: true, price: true, category: { select: { name: true } } } }
      },
      orderBy: { purchasedAt: 'desc' }
    });

    const formatted = purchases.map((p: any) => ({
      id: p.id,
      transactionId: p.transactionId,
      studentId: p.studentId,
      studentName: p.student?.name || 'Student',
      studentEmail: p.student?.email || '',
      noteId: p.noteId,
      noteTitle: p.note?.title || 'Digital Note',
      categoryName: p.note?.category?.name || 'General',
      amount: p.amount,
      paymentStatus: p.paymentStatus,
      paymentReference: p.paymentReference,
      paymentMethod: p.paymentMethod,
      purchaseDate: p.purchasedAt.toISOString().replace('T', ' ').substring(0, 16)
    }));

    return NextResponse.json({ success: true, purchases: formatted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch purchases' }, { status: 500 });
  }
}
