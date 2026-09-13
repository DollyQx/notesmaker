import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'notes-pdfs';

// Initialize Supabase Admin Client using Service Role Key for secure server-side storage access
export const getSupabaseAdmin = () => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || SUPABASE_URL.includes('placeholder')) {
    return null;
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
};

/**
 * Uploads a PDF file to the private Supabase Storage bucket 'notes-pdfs'
 */
export async function uploadPdfToStorage(
  fileBuffer: Buffer | Uint8Array,
  fileName: string,
  contentType: string = 'application/pdf'
): Promise<{ success: boolean; path?: string; error?: string }> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    // Fallback path when Supabase is not configured yet in local development
    const mockPath = `storage/pdfs/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    return { success: true, path: mockPath };
  }

  try {
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `notes/${Date.now()}_${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, fileBuffer, {
        contentType,
        upsert: true
      });

    if (error) {
      console.error('Supabase Storage Upload Error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, path: data.path };
  } catch (err: any) {
    console.error('Supabase Upload Exception:', err);
    return { success: false, error: err.message || 'Failed to upload PDF to Supabase Storage' };
  }
}

/**
 * Generates a short-lived signed URL (default 60 seconds) for private PDF streaming.
 * Prevents Vercel serverless function payload limit issues on large files.
 */
export async function generateSignedUrl(
  path: string,
  expiresInSeconds: number = 60
): Promise<{ success: boolean; signedUrl?: string; error?: string }> {
  const supabase = getSupabaseAdmin();

  if (!supabase || !path || path.startsWith('storage/pdfs/')) {
    return { success: false, error: 'Supabase Storage credentials not configured or local path' };
  }

  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(path, expiresInSeconds);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, signedUrl: data.signedUrl };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to generate signed URL' };
  }
}

/**
 * Deletes a PDF object from Supabase Storage when note is deleted by Admin
 */
export async function deletePdfFromStorage(path: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase || !path || path.startsWith('storage/pdfs/')) return true;

  try {
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
    if (error) {
      console.warn('Failed to delete file from Supabase Storage:', error);
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}
