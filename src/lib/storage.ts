import fs from 'fs';
import path from 'path';

// Hostinger persistent storage directory outside public_html
const DEFAULT_STORAGE_DIR = '/home/u255845777/domains/notesstudy.online/storage/pdfs';

export function getStorageDir(): string {
  const customPath = process.env.PDF_STORAGE_DIR || process.env.PDF_STORAGE_PATH;
  if (customPath) {
    if (!fs.existsSync(customPath)) {
      fs.mkdirSync(customPath, { recursive: true });
    }
    return customPath;
  }

  // Check if Hostinger production domain path exists
  if (fs.existsSync('/home/u255845777/domains/notesstudy.online')) {
    if (!fs.existsSync(DEFAULT_STORAGE_DIR)) {
      fs.mkdirSync(DEFAULT_STORAGE_DIR, { recursive: true });
    }
    return DEFAULT_STORAGE_DIR;
  }

  // Fallback for local development environment
  const localDir = path.join(process.cwd(), 'storage', 'pdfs');
  if (!fs.existsSync(localDir)) {
    fs.mkdirSync(localDir, { recursive: true });
  }
  return localDir;
}

/**
 * Saves an uploaded PDF file buffer to persistent server storage outside public_html
 */
export async function uploadPdfToStorage(
  fileBuffer: Buffer | Uint8Array,
  fileName: string,
  contentType: string = 'application/pdf'
): Promise<{ success: boolean; path?: string; error?: string }> {
  try {
    const storageDir = getStorageDir();
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${cleanFileName}`;
    const destinationPath = path.join(storageDir, uniqueFileName);

    await fs.promises.writeFile(destinationPath, Buffer.from(fileBuffer));

    return { success: true, path: uniqueFileName };
  } catch (err: any) {
    console.error('PDF Storage Write Error:', err);
    return { success: false, error: err.message || 'Failed to save PDF document to persistent storage' };
  }
}

/**
 * Resolves a stored PDF file reference to its safe absolute filesystem path.
 * Enforces strict path traversal prevention.
 */
export function resolvePdfFilePath(fileRef: string): string | null {
  if (!fileRef || typeof fileRef !== 'string') return null;

  const storageDir = getStorageDir();
  // Strip any directory traversal or path prefixes
  const sanitizedFileName = path.basename(fileRef);
  const targetPath = path.join(/*turbopackIgnore: true*/ storageDir, sanitizedFileName);

  // Security check: ensure path is within storageDir
  const normalizedTarget = path.normalize(targetPath);
  const normalizedStorage = path.normalize(storageDir);
  if (!normalizedTarget.startsWith(normalizedStorage)) {
    console.error('Security Alert: Path traversal attempt detected:', fileRef);
    return null;
  }

  if (fs.existsSync(/*turbopackIgnore: true*/ normalizedTarget)) {
    return normalizedTarget;
  }

  return null;
}

/**
 * Deletes a PDF document from persistent storage when note is deleted by Admin
 */
export async function deletePdfFromStorage(fileRef: string): Promise<boolean> {
  try {
    const filePath = resolvePdfFilePath(fileRef);
    if (filePath && fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return true;
  } catch (err) {
    console.warn('Failed to delete file from persistent storage:', err);
    return false;
  }
}
