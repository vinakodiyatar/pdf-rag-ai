import { Router } from "express";
import chatController from "../controllers/chat.controller.js";

const router = Router();

router.get("/chat", chatController.handleChat);

export default router;
