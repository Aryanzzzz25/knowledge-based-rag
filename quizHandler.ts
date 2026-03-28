import { Request, Response } from "express";
import { OpenAI } from "langchain/llms/openai";
import { PineconeVectorStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
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

export async function quizHandler(req: Request, res: Response) {
  try {
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
    const vectorStore = new PineconeVectorStore(embeddings, { pineconeIndex: index });

    // Get relevant documents from the past week
    const retriever = vectorStore.asRetriever({ k: 10 });
    const documents = await retriever.getRelevantDocuments(
      "Generate quiz questions based on this content"
    );

    // Generate quiz from documents
    const quizPrompt = `Based on these documents, generate a JSON object with 5 multiple choice quiz questions:
${documents.map((d) => d.pageContent).join("\n\n")}

Return a JSON object with this structure:
{
  "questions": [
    {
      "question": "...",
      "options": ["a", "b", "c", "d"],
      "correctAnswer": 0,
      "explanation": "..."
    }
  ]
}`;

    const quizResponse = await llm.call(quizPrompt);
    const quiz = JSON.parse(quizResponse);

    res.json({
      quiz,
      generatedAt: new Date().toISOString(),
      documentCount: documents.length,
    });
  } catch (error) {
    console.error("Quiz generation error:", error);
    res.status(500).json({ error: "Quiz generation failed" });
  }
}