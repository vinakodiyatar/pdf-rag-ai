import geminiClient from "../config/gemini.js";
import env from "../config/env.js";

/**
 * Service for Google Gemini interactions
 */
export const aiService = {
  /**
   * Generates a context-grounded response using Gemini
   * @param {string} userQuery
   * @param {Array} contextDocs
   * @returns {Promise<string>}
   */
  async generateAnswer(userQuery, contextDocs = []) {
    const contextText =
      contextDocs.length > 0
        ? JSON.stringify(contextDocs)
        : "No relevant documents found.";

    const systemPrompt = `
You are a helpful AI Assistant who answers user queries
based on the available context from PDF files.

Context:
${contextText}
`;

    const chatResult = await geminiClient.models.generateContent({
      model: env.GEMINI_CHAT_MODEL,
      contents: userQuery,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    return chatResult.text || "No response generated.";
  },
};

export default aiService;
