import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { uploadPdfToStorage } from '@/lib/storage';

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

    // 3. Convert file to buffer and upload to private Supabase bucket 'notes-pdfs'
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadRes = await uploadPdfToStorage(buffer, file.name, file.type);

    if (!uploadRes.success || !uploadRes.path) {
      return NextResponse.json(
        { success: false, error: uploadRes.error || 'Failed to upload PDF to Supabase Storage' },
        { status: 500 }
      );
    }

    // Formatted size helper
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const formattedSize = `${sizeInMB} MB`;

    return NextResponse.json({
      success: true,
      fileRef: uploadRes.path,
      originalName: file.name,
      fileSize: formattedSize,
      message: 'PDF document securely uploaded to private Supabase Storage bucket'
    });
  } catch (error: any) {
    console.error('PDF Upload API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process PDF upload' },
      { status: 500 }
    );
  }
}
