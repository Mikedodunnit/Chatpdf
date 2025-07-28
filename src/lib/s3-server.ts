import { createClient } from '@supabase/supabase-js';
import fs from "fs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME!;

export async function downloadFromSupabase(file_key: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, error } = await supabase.storage.from(bucket).download(file_key);
      if (error || !data) {
        console.error("[downloadFromSupabase] Supabase download error", error);
        reject(error);
        return;
      }
      const file_name = `/tmp/elliott${Date.now().toString()}.pdf`;
      const arrayBuffer = await data.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      fs.writeFileSync(file_name, uint8Array);
      return resolve(file_name);
    } catch (error) {
      console.error("[downloadFromSupabase] General error", error);
      reject(error);
      return null;
    }
  });
}
