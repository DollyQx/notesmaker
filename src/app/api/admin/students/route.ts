import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        ...(search
          ? {
              OR: [
                { name: { contains: search } },
                { email: { contains: search } },
                { college: { contains: search } }
              ]
            }
          : {})
      },
      include: {
        purchases: {
          select: { amount: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = students.map((s: any) => {
      const totalSpent = s.purchases.reduce((acc: number, curr: { amount: number }) => acc + curr.amount, 0);
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        college: s.college || 'General Aspirant',
        joinedDate: s.createdAt.toISOString().split('T')[0],
        purchasesCount: s.purchases.length,
        totalSpent
      };
    });

    return NextResponse.json({ success: true, students: formatted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch students' }, { status: 500 });
  }
}
