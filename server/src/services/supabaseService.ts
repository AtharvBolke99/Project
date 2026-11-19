import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://waacxgunczcbbapsxbay.supabase.co';
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  '';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
      throw new Error('[SUPABASE] Missing SUPABASE_URL or SUPABASE_SECRET_KEY in environment variables.');
    }
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    console.log('[SUPABASE] Initialized Supabase client successfully.');
  }
  return supabaseClient;
}

export const BUCKET_PDFS = 'pdfs';
export const BUCKET_THUMBNAILS = 'thumbnails';

/**
 * Ensure storage buckets exist and are public for instant access
 */
export async function ensureBucketsExist(): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      console.warn('[SUPABASE] Failed to list buckets:', error.message);
      return;
    }

    const bucketNames = (buckets || []).map(b => b.name);

    if (!bucketNames.includes(BUCKET_PDFS)) {
      await supabase.storage.createBucket(BUCKET_PDFS, { public: true });
      console.log(`[SUPABASE] Created bucket "${BUCKET_PDFS}" (public)`);
    }

    if (!bucketNames.includes(BUCKET_THUMBNAILS)) {
      await supabase.storage.createBucket(BUCKET_THUMBNAILS, { public: true });
      console.log(`[SUPABASE] Created bucket "${BUCKET_THUMBNAILS}" (public)`);
    }
  } catch (err: any) {
    console.error('[SUPABASE] Error ensuring storage buckets:', err.message);
  }
}

/**
 * Upload a PDF or document file to Supabase Storage
 */
export async function uploadPdfToSupabase(
  filename: string,
  bufferOrPath: Buffer | string,
  contentType: string = 'application/pdf'
): Promise<{ path: string; publicUrl: string; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    const cleanFilename = path.basename(filename);

    let fileBuffer: Buffer;
    if (typeof bufferOrPath === 'string') {
      if (!fs.existsSync(bufferOrPath)) {
        throw new Error(`File does not exist at path: ${bufferOrPath}`);
      }
      fileBuffer = fs.readFileSync(bufferOrPath);
    } else {
      fileBuffer = bufferOrPath;
    }

    const { data, error } = await supabase.storage
      .from(BUCKET_PDFS)
      .upload(cleanFilename, fileBuffer, {
        contentType,
        upsert: true
      });

    if (error) {
      console.error(`[SUPABASE] Failed to upload PDF "${cleanFilename}":`, error.message);
      return { path: cleanFilename, publicUrl: '', error: error.message };
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_PDFS)
      .getPublicUrl(cleanFilename);

    console.log(`[SUPABASE] Uploaded PDF "${cleanFilename}" -> ${urlData.publicUrl}`);
    return {
      path: cleanFilename,
      publicUrl: urlData.publicUrl
    };
  } catch (err: any) {
    console.error('[SUPABASE] uploadPdfToSupabase exception:', err.message);
    return { path: filename, publicUrl: '', error: err.message };
  }
}

/**
 * Upload a Thumbnail / Image to Supabase Storage
 */
export async function uploadThumbnailToSupabase(
  filename: string,
  bufferOrPath: Buffer | string,
  contentType: string = 'image/jpeg'
): Promise<{ path: string; publicUrl: string; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    const cleanFilename = path.basename(filename);

    let fileBuffer: Buffer;
    if (typeof bufferOrPath === 'string') {
      if (!fs.existsSync(bufferOrPath)) {
        throw new Error(`File does not exist at path: ${bufferOrPath}`);
      }
      fileBuffer = fs.readFileSync(bufferOrPath);
    } else {
      fileBuffer = bufferOrPath;
    }

    const { data, error } = await supabase.storage
      .from(BUCKET_THUMBNAILS)
      .upload(cleanFilename, fileBuffer, {
        contentType,
        upsert: true
      });

    if (error) {
      console.error(`[SUPABASE] Failed to upload thumbnail "${cleanFilename}":`, error.message);
      return { path: cleanFilename, publicUrl: '', error: error.message };
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_THUMBNAILS)
      .getPublicUrl(cleanFilename);

    console.log(`[SUPABASE] Uploaded thumbnail "${cleanFilename}" -> ${urlData.publicUrl}`);
    return {
      path: cleanFilename,
      publicUrl: urlData.publicUrl
    };
  } catch (err: any) {
    console.error('[SUPABASE] uploadThumbnailToSupabase exception:', err.message);
    return { path: filename, publicUrl: '', error: err.message };
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFromSupabase(
  bucket: 'pdfs' | 'thumbnails',
  filename: string
): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    const cleanFilename = path.basename(filename);
    const { error } = await supabase.storage.from(bucket).remove([cleanFilename]);
    if (error) {
      console.warn(`[SUPABASE] Failed to delete "${cleanFilename}" from ${bucket}:`, error.message);
      return false;
    }
    console.log(`[SUPABASE] Deleted "${cleanFilename}" from ${bucket}`);
    return true;
  } catch (err: any) {
    console.error(`[SUPABASE] deleteFromSupabase error:`, err.message);
    return false;
  }
}

/**
 * Get Public URL for a stored file
 */
export function getSupabasePublicUrl(bucket: 'pdfs' | 'thumbnails', filename: string): string {
  const supabase = getSupabaseClient();
  const cleanFilename = path.basename(filename);
  const { data } = supabase.storage.from(bucket).getPublicUrl(cleanFilename);
  return data?.publicUrl || '';
}

/**
 * Download file buffer directly from Supabase
 */
export async function downloadFromSupabase(
  bucket: 'pdfs' | 'thumbnails',
  filename: string
): Promise<Buffer | null> {
  try {
    const supabase = getSupabaseClient();
    const cleanFilename = path.basename(filename);
    const { data, error } = await supabase.storage.from(bucket).download(cleanFilename);
    if (error || !data) {
      console.warn(`[SUPABASE] Failed to download "${cleanFilename}" from ${bucket}:`, error?.message);
      return null;
    }
    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (err: any) {
    console.error(`[SUPABASE] downloadFromSupabase error:`, err.message);
    return null;
  }
}
