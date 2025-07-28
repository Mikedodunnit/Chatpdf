import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getEmbeddings(text: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await model.embedContent(text.replace(/\n/g, " "));
    if (!result || !result.embedding || !Array.isArray(result.embedding.values)) {
      console.error("Gemini embedding API returned unexpected result:", result);
      throw new Error("Gemini embedding API returned unexpected result");
    }
    return result.embedding.values;
  } catch (error) {
    console.error("error calling gemini embeddings api", error);
    throw error;
  }
}
