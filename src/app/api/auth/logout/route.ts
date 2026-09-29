import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME, LEGACY_COOKIE_NAME, verifyToken, revokeSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token =
      request.cookies.get(COOKIE_NAME)?.value ||
      request.cookies.get(LEGACY_COOKIE_NAME)?.value;

    if (token) {
      const decoded = verifyToken(token);
      if (decoded?.sessionId) {
        await revokeSession(decoded.sessionId);
      }
    }

    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    response.cookies.delete(COOKIE_NAME);
    response.cookies.delete(LEGACY_COOKIE_NAME);
    return response;
  } catch (error) {
    const response = NextResponse.json({ success: true, message: 'Logged out' });
    response.cookies.delete(COOKIE_NAME);
    response.cookies.delete(LEGACY_COOKIE_NAME);
    return response;
  }
}
