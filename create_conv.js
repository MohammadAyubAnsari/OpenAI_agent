import "dotenv/config";
import { OpenAI } from "openai/client.js";

const client = new OpenAI();
client.conversations.create({}).then((e) => {
  console.log(`Conversation thread created id = `, e.id);
});
