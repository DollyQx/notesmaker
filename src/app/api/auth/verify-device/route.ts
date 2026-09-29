import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import {
  signToken,
  COOKIE_NAME,
  DEVICE_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createPersistentSession,
  hashOtp
} from '@/lib/auth';

const verifySchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'Verification code must be 6 digits'),
  deviceId: z.string().min(1, 'Device identifier is required')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = verifySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }

    const { email, otp, deviceId } = result.data;
    const lowerEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: lowerEmail }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User account not found' },
        { status: 404 }
      );
    }

    // Find the latest active verification record for this user and device
    const verification = await prisma.deviceVerification.findFirst({
      where: {
        userId: user.id,
        deviceIdentifier: deviceId,
        usedAt: null,
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!verification) {
      return NextResponse.json(
        { success: false, error: 'Verification code has expired or is invalid. Please request a new code.' },
        { status: 400 }
      );
    }

    // Brute-force rate limiting (Max 5 attempts)
    if (verification.attempts >= 5) {
      await prisma.deviceVerification.update({
        where: { id: verification.id },
        data: { usedAt: new Date() }
      });
      return NextResponse.json(
        { success: false, error: 'Too many incorrect attempts. This code has been invalidated for security. Please log in again to receive a new code.' },
        { status: 429 }
      );
    }

    // Verify hashed OTP
    const otpHashed = hashOtp(otp);
    if (otpHashed !== verification.otpHash) {
      await prisma.deviceVerification.update({
        where: { id: verification.id },
        data: { attempts: { increment: 1 } }
      });
      const remaining = 4 - verification.attempts;
      return NextResponse.json(
        { success: false, error: `Incorrect verification code. ${remaining > 0 ? `${remaining} attempts remaining.` : 'Code will be locked.'}` },
        { status: 400 }
      );
    }

    // Mark verification as used
    await prisma.deviceVerification.update({
      where: { id: verification.id },
      data: { usedAt: new Date() }
    });

    const userAgent = request.headers.get('user-agent') || 'Unknown Browser';
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

    // Approve the second device
    await prisma.userDevice.upsert({
      where: {
        userId_deviceIdentifier: {
          userId: user.id,
          deviceIdentifier: deviceId
        }
      },
      create: {
        userId: user.id,
        deviceIdentifier: deviceId,
        isVerified: true,
        firstSeenAt: new Date(),
        lastLoginAt: new Date(),
        ipAddress,
        userAgent: userAgent.slice(0, 500)
      },
      update: {
        isVerified: true,
        firstSeenAt: new Date(),
        lastLoginAt: new Date(),
        ipAddress,
        userAgent: userAgent.slice(0, 500)
      }
    });

    // Create persistent server session
    const { sessionToken } = await createPersistentSession(user.id, deviceId, ipAddress, userAgent);
    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'STUDENT' | 'ADMIN',
      sessionId: sessionToken
    });

    const response = NextResponse.json({
      success: true,
      message: 'Device verified and authorized successfully!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college
      }
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: '/'
    });

    response.cookies.set(DEVICE_COOKIE_NAME, deviceId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60,
      path: '/'
    });

    return response;
  } catch (error: any) {
    console.error('Device Verification API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Device verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
