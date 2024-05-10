import readline from 'node:readline';
import { openai } from "./openai.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

/**
 * Asynchronously generates a new message using the OpenAI chat completions.
 *
 * @param {Array} history - Array of previous messages in the chat history.
 * @param {string} message - The new message to be processed.
 * @return {string} The generated response message from OpenAI chat completions.
 */
async function newMessage(history, message) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [...history, message],
    model: 'gpt-3.5-turbo',
  });

  return chatCompletion.choices[0].message;
}

/**
 * Formats a user input message into a structured object.
 *
 * @param {string} userInput - The user input message.
 * @return {Object} The formatted message object with the role and content properties.
 */
function formatMessage(userInput) {
  return {role: 'user', content: 'userInput'};
}

  /**
   * Starts the chat process by asking for user input, processing it, and generating responses.
   *
   * @param {Array} history - An array of previous messages in the chat history.
   * @param {Object} userMessage - The user's message to be processed.
   * @return {Promise<Object>} A promise that resolves to the generated response message.
   */
function chat() {
  const history = [
    {
      role: 'system',
      content: `You're a helpful AI assistant! Answer the users question to the best of your abilities.`,
    },
  ];

  /**
   * Starts the chat process by asking for user input, processing it, and generating responses.
   */
  function start() {
    rl.question('You: ', async (userInput) => {
      if (userInput.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      const userMessage = formatMessage(userInput);
      const response = await newMessage(history, userMessage);

      history.push(userMessage, response);
      console.log(`\nAI🤖: ${response.content}\n`);
      start();
    });
  }
}

console.log("Chatbot initialized! Type 'exit' to end the chat.");
chat();
