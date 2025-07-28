import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";
import { CloudClient, Collection } from "chromadb";

const client = new CloudClient({
  apiKey: process.env.CHROMA_API_KEY || 'ck-CNtFo3uhZtx3j7jyX1wKbKQUXLFUuFwVJHXreT8JuVMi',
  tenant: process.env.CHROMA_TENANT || 'b1b2851f-52af-4ec3-8bb9-cc79505ad17d',
  database: process.env.CHROMA_DATABASE || 'chatpdf',
});

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    const collectionName = convertToAscii(fileKey)
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/^[_\-.]+|[_\-.]+$/g, '');
    const collection: Collection = await client.getOrCreateCollection({ name: collectionName });
    const queryResult = await collection.query({
      queryEmbeddings: [embeddings],
      nResults: 5,
      include: ["metadatas", "distances", "documents"],
    });
    // Chroma returns metadatas, distances, and documents arrays
    return (queryResult.metadatas[0] || []).map((metadata: any, i: number) => ({
      metadata,
      document: queryResult.documents[0]?.[i] ?? "",
      score: 1 - (queryResult.distances[0]?.[i] ?? 1), // Chroma returns distance, convert to similarity
    }));
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  try {
    console.log("[CONTEXT] Query:", query);
    console.log("[CONTEXT] FileKey:", fileKey);
    
    const queryEmbeddings = await getEmbeddings(query);
    console.log("[CONTEXT] Query embeddings length:", queryEmbeddings.length);
    
    const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
    console.log("[CONTEXT] Found matches:", matches.length);
    console.log("[CONTEXT] Match scores:", matches.map(m => m.score));

    // Much more permissive threshold - accept almost all matches
    let qualifyingDocs = matches.filter(
      (match) => match.score && match.score > 0.05
    );

    console.log("[CONTEXT] Qualifying docs after 0.05 threshold:", qualifyingDocs.length);

    // If still no context, accept all matches
    if (qualifyingDocs.length === 0) {
      console.log("[CONTEXT] No qualifying docs, accepting all matches");
      qualifyingDocs = matches.filter(match => match.document && match.document.trim().length > 0);
    }

    // If still no context, try with a completely different approach
    if (qualifyingDocs.length === 0) {
      console.log("[CONTEXT] Still no context, trying to get all documents from collection");
      try {
        const collectionName = convertToAscii(fileKey)
          .replace(/[^a-zA-Z0-9._-]/g, '_')
          .replace(/^[_\-.]+|[_\-.]+$/g, '');
        const collection: Collection = await client.getOrCreateCollection({ name: collectionName });
        const allDocs = await collection.get({
          include: ["documents"],
        });
        console.log("[CONTEXT] All documents in collection:", allDocs.documents?.length || 0);
                 if (allDocs.documents && Array.isArray(allDocs.documents[0]) && allDocs.documents[0].length > 0) {
           qualifyingDocs = allDocs.documents[0].map((doc: string, i: number) => ({
             document: doc,
             score: 0.5, // Default score
             metadata: {}
           }));
         }
      } catch (error) {
        console.log("[CONTEXT] Error getting all documents:", error);
      }
    }

    console.log("[CONTEXT] Final qualifying docs:", qualifyingDocs.length);

    let docs = qualifyingDocs.map((match) => match.document);
    const context = docs.join("\n").substring(0, 3000);
    
    console.log("[CONTEXT] Final context length:", context.length);
    console.log("[CONTEXT] Context preview:", context.substring(0, 200) + "...");
    
    // If context is still empty, return a default message
    if (!context || context.trim().length === 0) {
      console.log("[CONTEXT] No context found, returning default message");
      return "The document has been processed and is available for querying. Please ask specific questions about the content.";
    }
    
    return context;
  } catch (error) {
    console.error("[CONTEXT] Error in getContext:", error);
    return "The document is available for querying. Please ask specific questions about the content.";
  }
}
