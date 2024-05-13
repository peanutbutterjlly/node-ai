import { OpenAIEmbeddings } from '@langchain/openai';
import 'dotenv/config';
import { Document } from "langchain/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
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

/**
 * Asynchronously searches for similar documents in the store based on the given query.
 *
 * @param {string} query - The query string to search for.
 * @param {number} [count=1] - The number of similar documents to return. Defaults to 1.
 * @return {Promise<Array<Object>>} A promise that resolves to an array of similar documents.
 */
async function search(query, count=1) {
  const store = await createStore();
  return store.similaritySearch(query, count);
}

console.log(await search('thought provoking'));
