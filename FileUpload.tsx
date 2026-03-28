import React, { useState } from "react";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";

interface FileUploadProps {
  onUploadSuccess: () => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(`✅ Uploaded "${file.name}" - ${data.chunks} chunks indexed`);
        onUploadSuccess();
      } else {
        setStatus("error");
        setMessage(data.error || "Upload failed");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-8">
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-500 rounded-lg p-12 cursor-pointer hover:border-blue-500 transition">
        <Upload className="w-12 h-12 text-slate-400 mb-4" />
        <p className="text-lg font-semibold text-white mb-2">
          Drop your files here
        </p>
        <p className="text-sm text-slate-400">
          Supports PDF, TXT, MD (Max 50MB)
        </p>
        <input
          type="file"
          onChange={handleUpload}
          disabled={loading}
          accept=".pdf,.txt,.md"
          className="hidden"
        />
      </label>

      {status === "success" && (
        <div className="mt-4 flex items-center gap-2 text-green-400">
          <CheckCircle className="w-5 h-5" />
          {message}
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 flex items-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          {message}
        </div>
      )}
    </div>
  );
}