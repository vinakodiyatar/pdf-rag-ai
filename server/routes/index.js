import { Router } from "express";
import pdfRoutes from "./pdf.routes.js";
import chatRoutes from "./chat.routes.js";

const router = Router();

// Health check / API status
router.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "PDF RAG Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Mount module routes
router.use("/", pdfRoutes);
router.use("/", chatRoutes);

export default router;
