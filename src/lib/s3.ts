import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME!;

export async function uploadToSupabase(
  file: File
): Promise<{ file_key: string; file_name: string }> {
  const file_key =
    "uploads/" + Date.now().toString() + file.name.replace(/\s+/g, "-");

  const { data, error } = await supabase.storage.from(bucket).upload(file_key, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    throw error;
  }

  return {
    file_key,
    file_name: file.name,
  };
}

export function getSupabaseUrl(file_key: string) {
  return supabase.storage.from(bucket).getPublicUrl(file_key).data.publicUrl;
}
