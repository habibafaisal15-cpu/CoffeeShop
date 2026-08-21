import { createClient, SupabaseClient } from "@supabase/supabase-js";

const UPLOAD_BUCKET = "product-images";

let client: SupabaseClient | null = null;

export function getSupabaseAdmin() {
  const url =
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) return null;

  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return client;
}

export async function ensureUploadBucket() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;

  const { data: buckets } = await supabase.storage.listBuckets();
  if (buckets?.some((b) => b.name === UPLOAD_BUCKET)) return true;

  const { error } = await supabase.storage.createBucket(UPLOAD_BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
  });

  return !error;
}

/** Public URL for a file already in the product-images bucket. */
export function getSupabasePublicUrl(filename: string): string | null {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const {
    data: { publicUrl },
  } = supabase.storage.from(UPLOAD_BUCKET).getPublicUrl(filename);

  return publicUrl;
}

export async function uploadToSupabase(
  filename: string,
  buffer: Buffer,
  contentType: string
): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  await ensureUploadBucket();

  const { error } = await supabase.storage
    .from(UPLOAD_BUCKET)
    .upload(filename, buffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return getSupabasePublicUrl(filename);
}

export { UPLOAD_BUCKET };
