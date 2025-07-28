import { GoogleGenAI } from "@google/genai";
import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, chatId } = body;
    console.log("[CHAT API] Received body:", body);
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length != 1) {
      console.error("[CHAT API] Chat not found for chatId:", chatId);
      return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }
    const fileKey = _chats[0].fileKey;
    const lastMessage = messages[messages.length - 1];
    let context;
    try {
      context = await getContext(lastMessage.content, fileKey);
      console.log("[CHAT API] Context:", context);
    } catch (err) {
      console.error("[CHAT API] Error in getContext:", err);
      return NextResponse.json({ error: "context error", detail: String(err) }, { status: 500 });
    }

    // Build the prompt for Gemini
    const systemPrompt = `You are a knowledgeable AI assistant that provides well-structured, organized responses. Your responses should be:

1. **Clear and Concise**: Get to the point quickly while being thorough
2. **Well-Structured**: Use headings, bullet points, and numbered lists when appropriate
3. **Professional**: Maintain a helpful and informative tone
4. **Accurate**: Base your responses on the provided context only

**Response Format Guidelines:**
- Use **bold** for important terms and concepts
- Use bullet points (•) for lists of items, features, or steps
- Use numbered lists (1., 2., 3.) for sequential processes or rankings
- Use headings (##) for different sections when the response is long
- Use code blocks (\`\`\`) for code examples or technical terms
- Use blockquotes (>) for important notes or warnings

**Context Information:**
START CONTEXT BLOCK
${context}
END OF CONTEXT BLOCK

**Instructions:**
- Answer questions based on the provided context
- If the context is available but limited, provide the best answer possible with what information is available
- Be helpful and informative even with partial information
- Only say "I don't have enough information in the provided document to answer this question" if the context is completely empty or irrelevant
- If you have some context but it's not directly answering the question, try to provide related information or insights
- Organize complex answers with clear sections and subsections
- Highlight key points and important information
- Use formatting to improve readability`;

    const userMessages = messages.filter((m: any) => m.role === "user").map((m: any) => m.content).join("\n");
    const fullPrompt = `${systemPrompt}\nUser: ${userMessages}`;
    console.log("[CHAT API] Full prompt:", fullPrompt.slice(0, 1000));

    let response, reply;
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
      });
      reply = response.text;
      console.log("[CHAT API] Gemini reply:", reply);
    } catch (err) {
      console.error("[CHAT API] Error from Gemini API:", err);
      return NextResponse.json({ error: "gemini error", detail: String(err) }, { status: 500 });
    }

    // Save user message
    try {
      await db.insert(_messages).values({
        chatId,
        content: lastMessage.content || "",
        role: "user",
      });
      await db.insert(_messages).values({
        chatId,
        content: reply || "",
        role: "system",
      });
    } catch (err) {
      console.error("[CHAT API] Error saving messages to DB:", err);
      return NextResponse.json({ error: "db error", detail: String(err) }, { status: 500 });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[CHAT API] General error:", error, (error as any)?.stack);
    return NextResponse.json({ error: "internal server error", detail: String(error) }, { status: 500 });
  }
}
