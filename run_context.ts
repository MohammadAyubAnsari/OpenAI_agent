import "dotenv/config";
import { Agent, run } from "@openai/agents";

const customerSupportAgent = new Agent({
  name: "Customer Support Agent",
  instructions: `You are an expert customer support agent`,
});

async function main(q = "") {
  const result = await run(customerSupportAgent, q);
  console.log(`Result`, result.finalOutput);
}

main("Hey, I am unable to login");
