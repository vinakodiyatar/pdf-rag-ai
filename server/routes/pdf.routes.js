import { Router } from "express";
import pdfController from "../controllers/pdf.controller.js";
import { uploadSinglePdf } from "../middlewares/upload.middleware.js";

const router = Router();

router.post("/upload/pdf", uploadSinglePdf, pdfController.uploadPdf);
router.get("/current-file", pdfController.getCurrentFile);
router.get("/view-pdf/:filename", pdfController.viewPdf);

export default router;
