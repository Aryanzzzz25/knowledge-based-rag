import { Request, Response } from "express";
import { OpenAI } from "langchain/llms/openai";
import { PineconeVectorStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RetrievalQAChain } from "langchain/chains";
import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY!,
});

const llm = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY!,
  modelName: "gpt-3.5-turbo",
});

export async function chatHandler(req: Request, res: Response) {
  try {
    const { question, conversationHistory } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question required" });
    }

    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
    const vectorStore = new PineconeVectorStore(embeddings, { pineconeIndex: index });

    // Build context from conversation history
    const contextMessages = conversationHistory
      .slice(-5)
      .map((msg: any) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const chain = RetrievalQAChain.fromLLM(llm, vectorStore.asRetriever(), {
      prompt: `You are a helpful knowledge assistant. Use the provided context to answer questions about the user's saved documents.\n\nConversation context:\n${contextMessages}\n\nQuestion: {question}`,
    });

    const response = await chain.call({ query: question });

    res.json({
      answer: response.text,
      sources: response.source_documents?.map((doc: any) => ({
        fileName: doc.metadata.fileName,
        content: doc.pageContent.substring(0, 200),
      })),
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Chat failed" });
  }
}