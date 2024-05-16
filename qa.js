import { OpenAIEmbeddings } from '@langchain/openai';
import 'dotenv/config';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { YoutubeLoader } from 'langchain/document_loaders/web/youtube';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
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

/**
 * Loads and splits text from a YouTube video based on the provided URL.
 *
 * @param {string} video - The URL of the YouTube video.
 * @return {type} Description of the return value
 */
export function docsFromYTVideo(video) {
  const loader = YoutubeLoader.createFromUrl(video, {
    language: 'en',
    addVideoInfo: true,
  })
  return loader.loadAndSplit(
    new CharacterTextSplitter({
      separator: ' ',
      chunkSize: 2500,
      chunkOverlap: 100,
    })
  )
}

/**
 * Loads and splits text from a PDF document.
 *
 * @return {type} Description of the return value
 */
function docsFromPDF() {
  const loader = new PDFLoader('xbox.pdf');
  return loader.loadAndSplit(
    new CharacterTextSplitter({
      separator: '. ',
      chunkSize: 2500,
      chunkOverlap: 200,
    })
  )
}

/**
 * Asynchronously loads video and PDF documents, then creates a store from the combined documents.
 *
 * @return {Promise<MemoryVectorStore>} A Promise that resolves to the created MemoryVectorStore.
 */
async function loadStore() {
  const videoDocs = await docsFromYTVideo(video);
  const pdfDocs = await docsFromPDF();

  return createStore([...videoDocs, ...pdfDocs])
}

async function query() {
  const store = await loadStore();
  const results = await store.similaritySearch(question, 2);
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: `You're a helpful AI assistant. Answer questions to the best of your ability.`,
      },
      {
        role: 'user',
        content: `Answer the following question using the provided context. 
        If you can't answer the question with the context, don't lie and make up stuff. 
        Just say you need more context.

        Question: ${question}
        
        Context: ${results.map(r => r.pageContent).join('\n')}`,
      },
    ],
  });

  console.log(`Answer ${response.choices[0].message.content}\n\n
  Sources: ${results.map(r => r.metadata.source).join(', ')}`)
}


query()
