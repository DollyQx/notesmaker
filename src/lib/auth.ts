import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from './db';

export const COOKIE_NAME = 'notesstudy_token';
export const LEGACY_COOKIE_NAME = 'notesmaker_token';
export const DEVICE_COOKIE_NAME = 'notesstudy_did';

// Default persistent session duration (30 days)
export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length === 0) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CRITICAL SECURITY ERROR: JWT_SECRET environment variable is missing in production!');
    }
    return 'notes_study_dev_jwt_secret_key_change_in_production_2026';
  }
  return secret.trim();
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  name: string;
  sessionId?: string;
  college?: string;
  mobileNumber?: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

export function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp.trim()).digest('hex');
}

export function signToken(payload: TokenPayload, expiresIn: string = '30d'): string {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const secret = getJwtSecret();
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Creates a server-side persistent session with a 30-day lifetime
 */
export async function createPersistentSession(
  userId: string,
  deviceIdentifier?: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ sessionToken: string; expiresAt: Date }> {
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  await prisma.userSession.create({
    data: {
      sessionToken,
      userId,
      deviceIdentifier: deviceIdentifier || null,
      ipAddress: ipAddress ? ipAddress.slice(0, 100) : null,
      userAgent: userAgent ? userAgent.slice(0, 500) : null,
      expiresAt,
      lastActiveAt: new Date()
    }
  });

  return { sessionToken, expiresAt };
}

/**
 * Revokes a session server-side on explicit logout
 */
export async function revokeSession(sessionToken: string): Promise<void> {
  try {
    await prisma.userSession.deleteMany({
      where: { sessionToken }
    });
  } catch (error) {
    console.error('Session revocation error:', error);
  }
}

/**
 * Extracts or generates a device identifier from the request cookies
 */
export function getOrCreateDeviceId(request: NextRequest): { deviceId: string; isNew: boolean } {
  const existingDid = request.cookies.get(DEVICE_COOKIE_NAME)?.value;
  if (existingDid && existingDid.length >= 16 && existingDid.length <= 128) {
    return { deviceId: existingDid, isNew: false };
  }
  return { deviceId: crypto.randomUUID(), isNew: true };
}

/**
 * Authenticates request, validates server-side session, and applies rolling renewal
 */
export async function getAuthUser(request: NextRequest): Promise<TokenPayload | null> {
  try {
    // 1. Check HTTP-only Cookie (with legacy fallback)
    const cookieToken =
      request.cookies.get(COOKIE_NAME)?.value ||
      request.cookies.get(LEGACY_COOKIE_NAME)?.value;

    // 2. Fallback to Authorization Header
    const authHeader = request.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    const token = cookieToken || headerToken;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) return null;

    // 3. Server-Side Session Validation (if token includes sessionId)
    if (decoded.sessionId) {
      const dbSession = await prisma.userSession.findUnique({
        where: { sessionToken: decoded.sessionId }
      });

      // Session revoked or expired
      if (!dbSession || dbSession.expiresAt < new Date()) {
        return null;
      }

      // Rolling renewal: if last active > 24 hours ago, roll forward 30 days
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (dbSession.lastActiveAt < oneDayAgo) {
        prisma.userSession
          .update({
            where: { id: dbSession.id },
            data: {
              lastActiveAt: new Date(),
              expiresAt: new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000)
            }
          })
          .catch((err) => console.warn('Rolling session renewal error:', err.message));
      }
    }

    // 4. Verify user exists in database
    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true, college: true, mobileNumber: true }
    });

    if (!dbUser) return null;

    return {
      userId: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role as 'STUDENT' | 'ADMIN',
      sessionId: decoded.sessionId,
      college: dbUser.college || undefined,
      mobileNumber: dbUser.mobileNumber || undefined
    };
  } catch (error) {
    return null;
  }
}

export async function requireAdmin(request: NextRequest): Promise<{ user?: TokenPayload; errorResponse?: NextResponse }> {
  const user = await getAuthUser(request);

  if (!user) {
    return {
      errorResponse: NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required' },
        { status: 401 }
      )
    };
  }

  if (user.role !== 'ADMIN') {
    return {
      errorResponse: NextResponse.json(
        { success: false, error: 'Forbidden: Admin privilege required' },
        { status: 403 }
      )
    };
  }

  return { user };
}

export async function requireStudentOrAdmin(request: NextRequest): Promise<{ user?: TokenPayload; errorResponse?: NextResponse }> {
  const user = await getAuthUser(request);

  if (!user) {
    return {
      errorResponse: NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required' },
        { status: 401 }
      )
    };
  }

  return { user };
}
