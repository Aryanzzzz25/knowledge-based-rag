import React, { useState } from "react";
import { Upload, MessageSquare, Brain } from "lucide-react";
import FileUpload from "./components/FileUpload";
import ChatInterface from "./components/ChatInterface";
import QuizPanel from "./components/QuizPanel";

type Tab = "upload" | "chat" | "quiz";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [fileCount, setFileCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <header className="bg-black/50 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">Knowledge Base RAG</h1>
          </div>
          <div className="text-sm text-slate-400">
            {fileCount} files indexed
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {[
                { id: "upload" as Tab, label: "Upload", icon: Upload },
                { id: "chat" as Tab, label: "Chat", icon: MessageSquare },
                { id: "quiz" as Tab, label: "Weekly Quiz", icon: Brain },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeTab === item.id
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "upload" && (
              <FileUpload onUploadSuccess={() => setFileCount(fileCount + 1)} />
            )}
            {activeTab === "chat" && <ChatInterface />}
            {activeTab === "quiz" && <QuizPanel />}
          </div>
        </div>
      </div>
    </div>
  );
}