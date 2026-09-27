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

    // 3. Validate PDF magic bytes (%PDF-)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfHeader = buffer.subarray(0, 5).toString('ascii');
    if (!pdfHeader.startsWith('%PDF-')) {
      return NextResponse.json(
        { success: false, error: 'Uploaded file is not a valid PDF document (magic bytes mismatch)' },
        { status: 400 }
      );
    }

    // 4. Save to secure server storage outside public_html
    const uploadRes = await uploadPdfToStorage(buffer, file.name, file.type);

    if (!uploadRes.success || !uploadRes.path) {
      return NextResponse.json(
        { success: false, error: uploadRes.error || 'Failed to save PDF to persistent storage' },
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
      message: 'PDF document securely saved to protected persistent storage'
    });
  } catch (error: any) {
    console.error('PDF Upload API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process PDF upload' },
      { status: 500 }
    );
  }
}
