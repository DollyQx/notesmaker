import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { seedDatabase } from '@/lib/seed';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await seedDatabase();

    const [
      totalStudents,
      totalNotes,
      totalCategories,
      totalPurchases,
      revenueResult,
      recentPurchases,
      recentNotes
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.note.count(),
      prisma.category.count(),
      prisma.purchase.count(),
      prisma.purchase.aggregate({ _sum: { amount: true } }),
      prisma.purchase.findMany({
        take: 5,
        orderBy: { purchasedAt: 'desc' },
        include: {
          student: { select: { name: true, email: true } },
          note: { select: { title: true, category: { select: { name: true } } } }
        }
      }),
      prisma.note.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { name: true } }
        }
      })
    ]);

    const totalRevenue = revenueResult._sum.amount || 0;

    const formattedPurchases = recentPurchases.map((p: any) => ({
      id: p.id,
      transactionId: p.transactionId,
      studentName: p.student?.name || 'Student',
      studentEmail: p.student?.email || '',
      noteTitle: p.note?.title || 'Digital Note',
      categoryName: p.note?.category?.name || 'General',
      amount: p.amount,
      paymentMethod: p.paymentMethod,
      purchaseDate: p.purchasedAt.toISOString().split('T')[0]
    }));

    const formattedNotes = recentNotes.map((n: any) => ({
      id: n.id,
      title: n.title,
      price: n.price,
      categoryName: n.category?.name || 'General',
      salesCount: n.salesCount,
      author: n.author
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents,
        totalNotes,
        totalCategories,
        totalPurchases,
        totalRevenue
      },
      recentPurchases: formattedPurchases,
      recentNotes: formattedNotes
    });
  } catch (error: any) {
    console.error('Admin Dashboard API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
