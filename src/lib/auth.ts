import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './db';

export const COOKIE_NAME = 'notesstudy_token';
export const LEGACY_COOKIE_NAME = 'notesmaker_token';

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
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

export function signToken(payload: TokenPayload): string {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const secret = getJwtSecret();
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function getAuthUser(request: NextRequest): Promise<TokenPayload | null> {
  try {
    // 1. Check HTTP-only Cookie (new cookie name, with fallback to legacy for existing sessions)
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

    // Verify user still exists in DB
    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true }
    });

    if (!dbUser) return null;

    return {
      userId: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role as 'STUDENT' | 'ADMIN'
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
