import multer from "multer";
import fs from "fs";
import path from "path";
import env from "../config/env.js";

// Ensure upload directory exists
if (!fs.existsSync(env.UPLOADS_DIR)) {
  fs.mkdirSync(env.UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, env.UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || ".pdf";
    const name = path.basename(file.originalname, ext);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    path.extname(file.originalname).toLowerCase() === ".pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

export const uploadSinglePdf = upload.single("pdf");

export default upload;
