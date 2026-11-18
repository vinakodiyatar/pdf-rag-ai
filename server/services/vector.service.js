import { QdrantVectorStore } from "@langchain/qdrant";
import qdrantClient from "../config/qdrant.js";
import embeddings from "../config/embeddings.js";
import env from "../config/env.js";

let vectorStoreInstance = null;

/**
 * Service managing Qdrant vector retrieval
 */
export const vectorService = {
  /**
   * Lazily loads and caches the Qdrant vector store
   * @returns {Promise<QdrantVectorStore | null>}
   */
  async getVectorStore() {
    if (vectorStoreInstance) {
      return vectorStoreInstance;
    }

    try {
      vectorStoreInstance = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
          client: qdrantClient,
          collectionName: env.QDRANT_COLLECTION,
        },
      );
      return vectorStoreInstance;
    } catch (error) {
      console.warn(
        `[VectorService] Collection "${env.QDRANT_COLLECTION}" not accessible yet: ${error.message}`,
      );
      return null;
    }
  },

  /**
   * Searches for similar context documents given a query string
   * @param {string} query - The user question
   * @param {number} k - Number of context documents to retrieve
   * @returns {Promise<Array>} Array of retrieved documents
   */
  async searchSimilarDocuments(query, k = 2) {
    const store = await this.getVectorStore();
    if (!store) {
      return [];
    }

    try {
      const retriever = store.asRetriever({ k });
      const docs = await retriever.invoke(query);
      return docs;
    } catch (error) {
      console.error("[VectorService] Retrieval error:", error.message);
      return [];
    }
  },
};

export default vectorService;
