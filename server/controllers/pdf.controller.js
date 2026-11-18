import fs from "fs";
import pdfService from "../services/pdf.service.js";
import queueService from "../services/queue.service.js";

/**
 * PDF Controller handling file uploads, viewing, and state retrieval
 */
export const pdfController = {
  /**
   * Uploads a single PDF file and pushes processing job to BullMQ
   */
  async uploadPdf(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No PDF file provided." });
      }

      const job = await queueService.enqueuePdf(req.file);
      const baseUrl = `${req.protocol}://${req.get("host")}`;

      return res.status(200).json({
        message: "File uploaded successfully!",
        jobId: job.id,
        fileName: req.file.originalname,
        fileUrl: `${baseUrl}/view-pdf/${encodeURIComponent(req.file.filename)}`,
      });
    } catch (error) {
      console.error("[PdfController] Upload error:", error);
      next(error);
    }
  },

  /**
   * Returns information about the currently active / latest uploaded PDF
   */
  getCurrentFile(req, res, next) {
    try {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const result = pdfService.getLatestFile(baseUrl);
      return res.status(200).json(result);
    } catch (error) {
      console.error("[PdfController] GetCurrentFile error:", error);
      return res.status(200).json({ file: null });
    }
  },

  /**
   * Streams PDF file for inline viewing in the browser
   */
  viewPdf(req, res, next) {
    try {
      const { filename } = req.params;
      const filePath = pdfService.getSafeFilePath(filename);

      if (!filePath) {
        return res.status(404).send("File not found");
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline");

      const stream = fs.createReadStream(filePath);
      stream.on("error", (err) => {
        console.error("[PdfController] Stream error:", err);
        if (!res.headersSent) {
          res.status(500).send("Error reading file stream");
        }
      });
      stream.pipe(res);
    } catch (error) {
      console.error("[PdfController] ViewPdf error:", error);
      next(error);
    }
  },
};

export default pdfController;
