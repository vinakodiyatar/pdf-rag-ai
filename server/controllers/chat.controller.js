import vectorService from "../services/vector.service.js";
import aiService from "../services/ai.service.js";

/**
 * Chat Controller handling RAG question-answering
 */
export const chatController = {
  /**
   * Processes a user question via vector search + Gemini generation
   */
  async handleChat(req, res, next) {
    try {
      const userQuery = req.query.question || "What is UTGST?";

      // 1. Retrieve similar chunks from Qdrant
      const docs = await vectorService.searchSimilarDocuments(userQuery, 2);

      // 2. Generate response with Google Gemini using context
      const answer = await aiService.generateAnswer(userQuery, docs);

      return res.status(200).json({
        data: {
          message: answer,
          docs,
        },
        docs,
      });
    } catch (error) {
      console.error("[ChatController] Chat error:", error);
      next(error);
    }
  },
};

export default chatController;
