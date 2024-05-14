import 'dotenv/config';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { YoutubeLoader } from 'langchain/document_loaders/web/youtube';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { openai } from './openai.js';

const question = process.argv[2] || 'hi';
const video = 'https://youtu.be/zR_iuq2evXo?si=cG8rODgRgXOx9_Cn';

/**
 * A function that creates a MemoryVectorStore from the given documents using OpenAI embeddings.
 *
 * @param {type} docs - Description of the documents parameter
 * @return {type} Description of the return value
 */
export function createStore(docs) {
  return MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings());
}
