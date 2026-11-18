import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import env from "./env.js";

export const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: env.GOOGLE_API_KEY,
  model: env.GEMINI_EMBEDDING_MODEL,
});

export default embeddings;
