import app from "./app.js";
import env from "./config/env.js";

// Automatically start background worker in-process (e.g. for Render single-instance deploy)
if (env.RUN_WORKER) {
  import("./worker.js")
    .then(() => {
      console.log("⚙️  Background BullMQ worker initialized in-process.");
    })
    .catch((err) => {
      console.error("❌ Failed to start background worker:", err);
    });
}

const server = app.listen(env.PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 PDF RAG Server running on http://localhost:${env.PORT}`);
  console.log(`📁 Uploads directory: ${env.UPLOADS_DIR}`);
  console.log(`🧠 Qdrant endpoint: ${env.QDRANT_URL}`);
  console.log(`📦 BullMQ queue: ${env.QUEUE_NAME}`);
  console.log(`===============================================`);
});

// Graceful shutdown handling
const handleShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => handleShutdown("SIGINT"));
process.on("SIGTERM", () => handleShutdown("SIGTERM"));
