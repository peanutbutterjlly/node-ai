import 'dotenv/config';

import OpenAI from "openai";
const openai = new OpenAI();

const results = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [
    {
      role: 'system',
      content: `You're an AI assistant, answer any question to the best of your ability.`
    },
    {
      role: 'user',
      content: `Hi!` // this is your prompt, pal!
    }
  ]
});

console.log(results.choices[0].message.content);
