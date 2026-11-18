import fileUploadQueue from "../config/queue.js";

/**
 * Service handling BullMQ queue jobs
 */
export const queueService = {
  /**
   * Enqueues a PDF file for background processing and vector indexing
   * @param {Express.Multer.File} file
   * @returns {Promise<import("bullmq").Job>}
   */
  async enqueuePdf(file) {
    const job = await fileUploadQueue.add("process-pdf", {
      fileName: file.originalname,
      destination: file.destination,
      path: file.path,
    });

    console.log(`[Queue] Added job ${job.id} for file: ${file.originalname}`);
    return job;
  },
};

export default queueService;
