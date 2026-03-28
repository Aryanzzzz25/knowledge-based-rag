import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { uploadHandler } from "./handlers/uploadHandler.js";
import { chatHandler } from "./handlers/chatHandler.js";
import { quizHandler } from "./handlers/quizHandler.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const upload = multer({ dest: "uploads/" });

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "../dist/client")));

// Routes
app.post("/api/upload", upload.single("file"), uploadHandler);
app.post("/api/chat", chatHandler);
app.get("/api/quiz/weekly", quizHandler);

// Fallback to React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/client/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});