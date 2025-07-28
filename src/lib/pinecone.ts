
import { downloadFromSupabase } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import md5 from "md5";
import { getEmbeddings } from "./embeddings";
import { convertToAscii } from "./utils";
import { CloudClient, Collection } from "chromadb";

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

// Minimal local Document type
class Document {
  pageContent: string;
  metadata: any;
  constructor({ pageContent, metadata }: { pageContent: string; metadata: any }) {
    this.pageContent = pageContent;
    this.metadata = metadata;
  }
}

// Minimal local RecursiveCharacterTextSplitter
class RecursiveCharacterTextSplitter {
  async splitDocuments(docs: Document[]): Promise<Document[]> {
    // For simplicity, just return the docs as-is (no splitting)
    return docs;
  }
}

const client = new CloudClient({
  apiKey:  'ck-CNtFo3uhZtx3j7jyX1wKbKQUXLFUuFwVJHXreT8JuVMi',
  tenant: 'b1b2851f-52af-4ec3-8bb9-cc79505ad17d',
  database:'chatpdf',
});

export async function loadChromaIntoCollection(fileKey: string) {
  // 1. obtain the pdf -> download and read from pdf
  console.log("downloading from supabase into file system");
  const file_name = await downloadFromSupabase(fileKey);
  if (!file_name) {
    throw new Error("could not download from supabase");
  }
  console.log("loading pdf into memory" + file_name);
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];
  console.log("Loaded pages:", pages.map(p => p.pageContent).join("\n").slice(0, 500));
  if (!pages.length || !pages.some(p => p.pageContent.trim())) {
    throw new Error("No text found in PDF. Please upload a text-based PDF.");
  }
  console.log("loading pdf into memory" + file_name);

  // 2. split and segment the pdf
  const documents = await Promise.all(pages.map((page: PDFPage) => prepareDocument(page)));

  // 3. vectorise and embed individual documents
  const vectors = await Promise.all(documents.flat().map((doc: Document) => embedDocument(doc)));

  // 4. upsert to Chroma CloudClient
  let collectionName = convertToAscii(fileKey)
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/^[_\-.]+|[_\-.]+$/g, '');
  if (collectionName.length < 3) collectionName = 'col_' + collectionName;
  if (vectors.length === 0) {
    throw new Error("No vectors to upsert to Chroma");
  }
  let collection: Collection;
  try {
    collection = await client.getOrCreateCollection({ name: collectionName });
  } catch (e: any) {
    throw new Error(`Failed to get or create collection: ${e.message}`);
  }
  await collection.add({
    ids: vectors.map((v: any) => v.id),
    embeddings: vectors.map((v: any) => v.values),
    metadatas: vectors.map((v: any) => ({
      pageNumber: v.metadata.pageNumber,
      // add other small fields if needed
    })),
    documents: vectors.map((v: any) => v.metadata.text),
  });

  return documents[0];
}

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);
    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    };
  } catch (error) {
    console.log("error embedding document", error);
    throw error;
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");
  // split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
}
