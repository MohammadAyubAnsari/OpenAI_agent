import "dotenv/config";
import { Agent, run, InputGuardrail } from "@openai/agents";

const mathsAgent = new Agent({
  name: "Maths Agent",
  instructions: "You are an expert maths ai agent.",
  tools: [],
});

async function main(q = "") {
  const result = await run(mathsAgent, q);
  console.log("Result :", result.finalOutput);
}

main("write a code in javascript to add two numbers");
