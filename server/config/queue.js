import { Queue } from "bullmq";
import env from "./env.js";

function buildRedisOptions() {
  if (env.REDIS_URL) {
    try {
      const parsed = new URL(env.REDIS_URL);
      return {
        host: parsed.hostname,
        port: parseInt(parsed.port, 10) || 6379,
        username: parsed.username || undefined,
        password: parsed.password || undefined,
        tls:
          parsed.protocol === "rediss:"
            ? { rejectUnauthorized: false }
            : undefined,
        maxRetriesPerRequest: null,
      };
    } catch (err) {
      console.warn(`[Queue] Failed to parse REDIS_URL: ${err.message}`);
    }
  }

  return {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    maxRetriesPerRequest: null,
  };
}

export const redisConnectionOptions = buildRedisOptions();

export const fileUploadQueue = new Queue(env.QUEUE_NAME, {
  connection: redisConnectionOptions,
});

// Handle connection warnings without crashing the server if Redis isn't running yet
fileUploadQueue.on("error", (err) => {
  console.warn(`[Queue] Redis warning: ${err.message}`);
});

export default fileUploadQueue;
