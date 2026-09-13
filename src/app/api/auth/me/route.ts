import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { seedDatabase } from '@/lib/seed';

export async function GET(request: NextRequest) {
  try {
    await seedDatabase();
    const user = await getAuthUser(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, user: null },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, user: null },
      { status: 500 }
    );
  }
}
