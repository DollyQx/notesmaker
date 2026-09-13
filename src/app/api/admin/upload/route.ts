import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Max file size: 50 MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No PDF file uploaded' }, { status: 400 });
    }

    // 1. File type validation
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file format. Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // 2. File size validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds maximum allowed limit of 50 MB' },
        { status: 400 }
      );
    }

    // 3. Ensure secure private storage directory exists outside public directory
    const storageDir = path.join(process.cwd(), 'storage', 'pdfs');
    await fs.mkdir(storageDir, { recursive: true });

    // 4. Generate safe unique filename
    const safeName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.pdf`;
    const targetPath = path.join(storageDir, safeName);

    // 5. Convert ArrayBuffer and write to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(targetPath, buffer);

    // Formatted size helper
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const formattedSize = `${sizeInMB} MB`;

    // Return the secure storage file reference (not a public URL)
    const fileRef = `storage/pdfs/${safeName}`;

    return NextResponse.json({
      success: true,
      fileRef,
      originalName: file.name,
      fileSize: formattedSize,
      message: 'PDF file securely uploaded and stored on server'
    });
  } catch (error: any) {
    console.error('PDF Upload API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload PDF file' },
      { status: 500 }
    );
  }
}
