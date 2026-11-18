import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT, 10) || 8000,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
  REDIS_URL: process.env.REDIS_URL || "",
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: parseInt(process.env.REDIS_PORT, 10) || 6379,
  QDRANT_URL: process.env.QDRANT_URL || "http://127.0.0.1:6333",
  QDRANT_API_KEY: process.env.QDRANT_API_KEY || "",
  QDRANT_COLLECTION: process.env.QDRANT_COLLECTION || "pdf-docs",
  QUEUE_NAME: process.env.QUEUE_NAME || "file-upload-queue",
  GEMINI_CHAT_MODEL: process.env.GEMINI_CHAT_MODEL || "gemini-2.5-flash",
  GEMINI_EMBEDDING_MODEL:
    process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001",
  UPLOADS_DIR: path.resolve(process.cwd(), "uploads"),
  RUN_WORKER: process.env.RUN_WORKER !== "false",
};

export default env;
