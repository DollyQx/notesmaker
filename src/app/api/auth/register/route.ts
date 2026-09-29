import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import {
  hashPassword,
  signToken,
  COOKIE_NAME,
  DEVICE_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createPersistentSession,
  getOrCreateDeviceId
} from '@/lib/auth';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  college: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0]?.message || 'Invalid registration data' },
        { status: 400 }
      );
    }

    const { name, email, password, college } = result.data;
    const lowerEmail = email.toLowerCase().trim();

    // Check duplicate
    const existing = await prisma.user.findUnique({
      where: { email: lowerEmail }
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    // SECURITY: Force role to STUDENT regardless of any request body tampering
    const newUser = await prisma.user.create({
      data: {
        name,
        email: lowerEmail,
        password: hashedPassword,
        role: 'STUDENT',
        college
      }
    });

    const userAgent = request.headers.get('user-agent') || 'Unknown Browser';
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const { deviceId } = getOrCreateDeviceId(request);

    // Register initial device as verified (Device 1)
    await prisma.userDevice.create({
      data: {
        userId: newUser.id,
        deviceIdentifier: deviceId,
        isVerified: true,
        firstSeenAt: new Date(),
        lastLoginAt: new Date(),
        ipAddress,
        userAgent: userAgent.slice(0, 500)
      }
    });

    // Create persistent server-side session
    const { sessionToken } = await createPersistentSession(newUser.id, deviceId, ipAddress, userAgent);

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: 'STUDENT',
      sessionId: sessionToken
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        college: newUser.college
      }
    });

    // Set persistent session cookie (30 days)
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: '/'
    });

    // Set device identifier cookie
    response.cookies.set(DEVICE_COOKIE_NAME, deviceId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60,
      path: '/'
    });

    return response;
  } catch (error: any) {
    console.error('Register API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
