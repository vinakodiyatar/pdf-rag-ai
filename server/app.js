import express from "express";
import cors from "cors";
import env from "./config/env.js";
import routes from "./routes/index.js";
import {
  notFoundHandler,
  errorHandler,
} from "./middlewares/error.middleware.js";

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(env.UPLOADS_DIR));

// Register API routes
app.use("/", routes);

// 404 & Global Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
