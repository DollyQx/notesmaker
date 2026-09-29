import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendContactEnquiryEmail } from '@/lib/email';
import { sanitizeTextContent } from '@/lib/sanitize';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please provide a valid email address'),
  mobile: z.string().min(10, 'Mobile number must have at least 10 digits').max(15, 'Mobile number is too long'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(150, 'Subject is too long'),
  description: z.string().min(10, 'Please describe your query in at least 10 characters').max(3000, 'Message is too long')
});

// Simple in-memory rate limiting map: IP -> array of timestamps
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5; // Max 5 contact submissions per 15 minutes

  const timestamps = (rateLimitMap.get(ip) || []).filter((ts) => now - ts < windowMs);
  if (timestamps.length >= maxRequests) {
    return true;
  }

  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'anonymous';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many messages sent. Please wait 15 minutes before submitting another enquiry.'
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.issues[0]?.message || 'Invalid form data'
        },
        { status: 400 }
      );
    }

    const { name, email, mobile, subject, description } = result.data;

    // Sanitize user inputs
    const sanitizedName = sanitizeTextContent(name);
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedMobile = mobile.trim();
    const sanitizedSubject = sanitizeTextContent(subject);
    const sanitizedDescription = sanitizeTextContent(description);

    const emailRes = await sendContactEnquiryEmail({
      name: sanitizedName,
      email: sanitizedEmail,
      mobile: sanitizedMobile,
      subject: sanitizedSubject,
      description: sanitizedDescription
    });

    if (!emailRes.success) {
      console.error('Failed to dispatch contact enquiry email:', emailRes.error);
      // We still log and notify user gracefully
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully! The Notes Study team will review and respond soon.'
    });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while submitting your message.' },
      { status: 500 }
    );
  }
}
