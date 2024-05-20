import math from 'advanced-calculator';
import 'dotenv/config';
import { openai } from './openai.js';

const  QUESTION = process.argv[2] || 'hi';

const messages = [
  {
    role: 'user',
    content: QUESTION,
  },
];

const functions = {
  calculate({ expression }) {
    return math.evaluate(expression)
  },
};

/**
 * Retrieves a completion from the OpenAI chat model.
 *
 * @param {string} message - The user's input message.
 * @return {Promise<object>} A promise that resolves to an object containing the completion.
 */
function getCompletion(message) {
  return openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k-0613',
    messages,
    temperature: 0,
    functions: [
      {
        name: 'calculate',
        description: 'run a math expression',
        parameters: {
          type: 'object',
          properties: {
            expression: {
              type: 'string',
              description:
                'Then math expression to evaluate to like "2 * 3 + (21 / 2) ^2"',
            },
          },
          required: ['expression'],
        },
      },
    ],
  });
}

let response;
while (true) {
  response = await getCompletion(messages);

  if (response.choices[0].finish_reason === 'stop') {
    console.log(response.choices[0].message.content);
    break
  } else if (response.choices[0].finish_reason === 'function_call') {
    const fnName = response.choices[0].message.function_call.name;
    const args = response.choices[0].message.function_call.arguments;

    const functionToCall = functions[fnName];
    const params = JSON.parse(args);

    const result = functionToCall(params);

    messages.push({
      role: 'assistant',
      content: null,
      function_call: {
        name: fnName,
        arguments: args,
      }
    })

    messages.push({
      role: 'function',
      name: fnName,
      content: JSON.stringify({ result })
    })

  }
}
