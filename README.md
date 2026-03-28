# Knowledge Base RAG 📚

A powerful RAG (Retrieval-Augmented Generation) application for managing your personal knowledge base with intelligent chat and automatic quiz generation.

## Features

✅ **File Upload** - Upload PDFs, TXT, and Markdown files  
✅ **Semantic Search** - Ask questions about your documents  
✅ **Chat Interface** - Multi-turn conversation with your knowledge base  
✅ **Weekly Quiz** - Auto-generated quizzes based on your saved content  
✅ **Source Attribution** - Know where answers come from  

## Tech Stack

- **Backend**: Express.js + TypeScript
- **Frontend**: React 18 + Tailwind CSS
- **Vector DB**: Pinecone
- **LLM**: OpenAI GPT-3.5-turbo
- **Document Processing**: LangChain

## Quick Start

### Prerequisites

- Node.js 18+
- OpenAI API key
- Pinecone account and API key

### Installation

```bash
# Clone
git clone https://github.com/Aryanzzzz25/knowledge-base-rag.git
cd knowledge-base-rag

# Install
npm install

# Setup environment
cp .env.example .env
# Edit .env with your API keys