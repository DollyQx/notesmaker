import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import {
  comparePassword,
  signToken,
  COOKIE_NAME,
  DEVICE_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createPersistentSession,
  getOrCreateDeviceId,
  hashOtp
} from '@/lib/auth';
import { sendDeviceVerificationOtp } from '@/lib/email';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

function maskEmail(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const name = parts[0];
  const domain = parts[1];
  if (name.length <= 2) return `${name.charAt(0)}*@${domain}`;
  return `${name.charAt(0)}${'*'.repeat(Math.min(name.length - 2, 5))}${name.slice(-1)}@${domain}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const lowerEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: lowerEmail }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address or password' },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address or password' },
        { status: 401 }
      );
    }

    const userAgent = request.headers.get('user-agent') || 'Unknown Browser';
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const { deviceId } = getOrCreateDeviceId(request);

    // =========================================================================
    // ADMIN BYPASS: Administrators bypass device limit rules
    // =========================================================================
    if (user.role === 'ADMIN') {
      const { sessionToken } = await createPersistentSession(user.id, deviceId, ipAddress, userAgent);
      const token = signToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: 'ADMIN',
        sessionId: sessionToken
      });

      const response = NextResponse.json({
        success: true,
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
    }

    // =========================================================================
    // STUDENT DEVICE SECURITY & 48-HOUR ROLLING WINDOW POLICY
    // =========================================================================
    const rollingWindowHours = 48;
    const rollingWindowStart = new Date(Date.now() - rollingWindowHours * 60 * 60 * 1000);

    // 1. Check if this exact device is already known and verified for this student
    const existingDevice = await prisma.userDevice.findUnique({
      where: {
        userId_deviceIdentifier: {
          userId: user.id,
          deviceIdentifier: deviceId
        }
      }
    });

    if (existingDevice && existingDevice.isVerified) {
      // Re-authenticating from an approved/known device does NOT count as a new device
      await prisma.userDevice.update({
        where: { id: existingDevice.id },
        data: {
          lastLoginAt: new Date(),
          ipAddress,
          userAgent: userAgent.slice(0, 500)
        }
      });

      const { sessionToken } = await createPersistentSession(user.id, deviceId, ipAddress, userAgent);
      const token = signToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: 'STUDENT',
        sessionId: sessionToken
      });

      const response = NextResponse.json({
        success: true,
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
    }

    // 2. It is a NEW device. Count distinct verified devices first seen within the rolling 48-hour window
    const recentVerifiedCount = await prisma.userDevice.count({
      where: {
        userId: user.id,
        isVerified: true,
        firstSeenAt: { gte: rollingWindowStart }
      }
    });

    // CASE A: 1st Device in rolling 48-hour period -> Allowed normally
    if (recentVerifiedCount === 0) {
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

      const { sessionToken } = await createPersistentSession(user.id, deviceId, ipAddress, userAgent);
      const token = signToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: 'STUDENT',
        sessionId: sessionToken
      });

      const response = NextResponse.json({
        success: true,
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
    }

    // CASE B: 2nd Device in rolling 48-hour period -> Email verification OTP required
    if (recentVerifiedCount === 1) {
      // Generate secure 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpHashed = hashOtp(otp);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Delete prior uncompleted verifications for this device
      await prisma.deviceVerification.deleteMany({
        where: {
          userId: user.id,
          deviceIdentifier: deviceId
        }
      });

      await prisma.deviceVerification.create({
        data: {
          userId: user.id,
          deviceIdentifier: deviceId,
          otpHash: otpHashed,
          expiresAt
        }
      });

      // Save device record as unverified until OTP confirmed
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
          isVerified: false,
          firstSeenAt: new Date(),
          lastLoginAt: new Date(),
          ipAddress,
          userAgent: userAgent.slice(0, 500)
        },
        update: {
          isVerified: false,
          ipAddress,
          userAgent: userAgent.slice(0, 500)
        }
      });

      // Dispatch verification code via email
      await sendDeviceVerificationOtp(user.email, user.name, otp);

      const response = NextResponse.json({
        success: true,
        requiresVerification: true,
        deviceId,
        email: user.email,
        emailMasked: maskEmail(user.email),
        message: 'A 6-digit verification code has been sent to your registered email to authorize this second device.'
      });

      response.cookies.set(DEVICE_COOKIE_NAME, deviceId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 365 * 24 * 60 * 60,
        path: '/'
      });

      return response;
    }

    // CASE C: 3rd New Device in rolling 48-hour period -> BLOCK login
    return NextResponse.json(
      {
        success: false,
        error: 'Security Policy Restriction: You have reached the maximum limit of 2 authorized devices within a rolling 48-hour window. Access from a 3rd device is blocked. Please use an existing authorized device or try again after 48 hours.'
      },
      { status: 403 }
    );
  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
