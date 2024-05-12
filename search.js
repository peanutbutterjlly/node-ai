import { Document } from "langchain/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { openai } from './openai.js';
import { movies } from "./movies.js";

/**
 * Creates a new MemoryVectorStore from the documents generated using the movies data.
 *
 * @return {MemoryVectorStore} The newly created MemoryVectorStore.
 */
function createStore() {
  return MemoryVectorStore.fromDocuments(
    movies.map(
      ({description, id, title}) =>
        new Document({
          pageContent: `Title: ${title}\n${description}`,
          metadata: { source: id, title },
        })
    ),
    new OpenAIEmbeddings()
  );
}
