import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadChromaIntoCollection } from "@/lib/pinecone";
import { getSupabaseUrl } from "@/lib/s3";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// /api/create-chat
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    console.error("No userId found in auth()");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { file_key, file_name } = body;
    console.log("[API] Received body:", body);
    let chromaResult;
    try {
      console.log("[API] Calling loadChromaIntoCollection with file_key:", file_key);
      chromaResult = await loadChromaIntoCollection(file_key);
      console.log("[API] loadChromaIntoCollection success");
    } catch (err) {
      if (err && typeof err === 'object' && 'stack' in err) {
        console.error("[API] Error in loadChromaIntoCollection:", err, (err as any).stack);
      } else {
        console.error("[API] Error in loadChromaIntoCollection:", err);
      }
      return NextResponse.json({ error: "Chroma/Supabase error", detail: String(err) }, { status: 500 });
    }
    let chat_id;
    let pdfUrl;
    try {
      console.log("[API] Generating Supabase URL for file_key:", file_key);
      pdfUrl = getSupabaseUrl(file_key);
      console.log("[API] Supabase URL:", pdfUrl);
    } catch (err) {
      if (err && typeof err === 'object' && 'stack' in err) {
        console.error("[API] Error generating Supabase URL:", err, (err as any).stack);
      } else {
        console.error("[API] Error generating Supabase URL:", err);
      }
      return NextResponse.json({ error: "Supabase URL error", detail: String(err) }, { status: 500 });
    }
    try {
      console.log("[API] Inserting chat into DB with:", {
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl,
        userId,
      });
      const result = await db
        .insert(chats)
        .values({
          fileKey: file_key,
          pdfName: file_name,
          pdfUrl,
          userId,
        })
        .returning({
          insertedId: chats.id,
        });
      chat_id = result[0].insertedId;
      console.log("[API] DB insert success, chat_id:", chat_id);
    } catch (err) {
      if (err && typeof err === 'object' && 'stack' in err) {
        console.error("[API] Error inserting chat into DB:", err, (err as any).stack);
      } else {
        console.error("[API] Error inserting chat into DB:", err);
      }
      return NextResponse.json({ error: "DB error", detail: String(err) }, { status: 500 });
    }
    return NextResponse.json(
      {
        chat_id,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error && typeof error === 'object' && 'stack' in error) {
      console.error("[API] General error in /api/create-chat:", error, (error as any).stack);
    } else {
      console.error("[API] General error in /api/create-chat:", error);
    }
    return NextResponse.json(
      { error: "internal server error", detail: String(error) },
      { status: 500 }
    );
  }
}
