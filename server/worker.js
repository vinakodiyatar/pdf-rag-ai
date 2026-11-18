import { Worker } from "bullmq";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { QdrantVectorStore } from "@langchain/qdrant";
import env from "./config/env.js";
import embeddings from "./config/embeddings.js";
import qdrantClient from "./config/qdrant.js";
import { redisConnectionOptions } from "./config/queue.js";

const worker = new Worker(
  env.QUEUE_NAME,
  async (job) => {
    console.log("================================");
    console.log("JOB RECEIVED!");
    console.log("Job ID:", job.id);
    console.log("Job name:", job.name);
    console.log("Job data:", job.data);

    const loader = new PDFLoader(job.data.path);
    const docs = await loader.load();

    console.log(`Loaded ${docs.length} page(s) from ${job.data.fileName}`);

    await QdrantVectorStore.fromDocuments(docs, embeddings, {
      client: qdrantClient,
      collectionName: env.QDRANT_COLLECTION,
    });

    console.log("PDF indexed into Qdrant vector store successfully!");
    console.log("Total pages indexed:", docs.length);

    return docs.length;
  },
  {
    concurrency: 5,
    connection: redisConnectionOptions,
  },
);

worker.on("ready", () => {
  console.log(`Worker is ready and listening to queue: "${env.QUEUE_NAME}"`);
});

worker.on("active", (job) => {
  console.log(`Job active: ${job.id}`);
});

worker.on("completed", (job, result) => {
  console.log(`Job completed: ${job.id} | Pages indexed: ${result}`);
});

worker.on("failed", (job, err) => {
  console.error(`Job failed: ${job?.id}`, err);
});

worker.on("error", (err) => {
  console.error("Worker error:", err);
});

console.log(`PDF Worker started on queue "${env.QUEUE_NAME}"...`);
