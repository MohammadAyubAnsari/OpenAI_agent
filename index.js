import "dotenv/config";
import { Agent, run } from "@openai/agents";

const helloAgent = new Agent({
  name: "Hello Agent",
  instructions: "You are an agent that always says hello world with users name",
});

run(helloAgent, "Hey there, my name is Bob").then((result) => {
  console.log(result.finalOutput);
});
