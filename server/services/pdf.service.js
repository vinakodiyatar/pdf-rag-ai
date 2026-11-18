import fs from "fs";
import path from "path";
import env from "../config/env.js";

/**
 * Service handling local PDF file operations
 */
export const pdfService = {
  /**
   * Retrieves the latest uploaded PDF file metadata
   * @param {string} baseUrl - Base URL of the server (e.g. http://localhost:8000)
   * @returns {{ fileName: string, fileUrl: string } | { file: null }}
   */
  getLatestFile(baseUrl = `http://localhost:${env.PORT}`) {
    if (!fs.existsSync(env.UPLOADS_DIR)) {
      return { file: null };
    }

    const files = fs
      .readdirSync(env.UPLOADS_DIR)
      .filter((file) => !file.startsWith("."));

    if (files.length === 0) {
      return { file: null };
    }

    // Sort by file creation/modification time descending
    files.sort((a, b) => {
      const statA = fs.statSync(path.join(env.UPLOADS_DIR, a));
      const statB = fs.statSync(path.join(env.UPLOADS_DIR, b));
      return statA.mtimeMs - statB.mtimeMs;
    });

    const latest = files[files.length - 1];

    // Clean generated timestamp-random suffix for human-readable display name
    const originalName =
      latest.replace(/\.pdf$/i, "").replace(/-\d+-\d+$/, "") + ".pdf";

    return {
      fileName: originalName,
      fileUrl: `${baseUrl}/view-pdf/${encodeURIComponent(latest)}`,
    };
  },

  /**
   * Safely resolves and checks the path for a requested PDF file
   * @param {string} filename
   * @returns {string | null} Safe file path or null if not found
   */
  getSafeFilePath(filename) {
    const safeFilename = path.basename(filename);
    const filePath = path.join(env.UPLOADS_DIR, safeFilename);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    return filePath;
  },
};

export default pdfService;
