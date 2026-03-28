import { Request, Response } from "express";
import { PineconeVectorStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Document } from "langchain/document";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY!,
});

export async function uploadHandler(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const fileType = fileName.split(".").pop()?.toLowerCase();

    let docs: Document[] = [];

    // Load file based on type
    if (fileType === "pdf") {
      const loader = new PDFLoader(filePath);
      docs = await loader.load();
    } else if (["txt", "md"].includes(fileType || "")) {
      const loader = new TextLoader(filePath);
      docs = await loader.load();
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // Split documents
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splits = await splitter.splitDocuments(docs);

    // Add metadata
    const docsWithMetadata = splits.map((doc) => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        fileName,
        uploadedAt: new Date().toISOString(),
      },
    }));

    // Store in Pinecone
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
    const vectorStore = await PineconeVectorStore.fromDocuments(
      docsWithMetadata,
      embeddings,
      { pineconeIndex: index }
    );

    res.json({
      success: true,
      message: "File uploaded and indexed",
      chunks: splits.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
}