import "dotenv/config";
import { Agent, run } from "@openai/agents";

const mathInputGuardrail = {
  name: "Math Homework Guardrail",
  execute: ({ input }) => {
    console.log(`TODO:We need to validate ${input}`);
    return {
      tripwireTriggered: false,
    };
  },
};

const mathsAgent = new Agent({
  name: "Maths Agent",
  instructions: "You are an expert maths ai agent.",
  inputGuardrails: [mathInputGuardrail],
});

async function main(q = "") {
  const result = await run(mathsAgent, q);
  console.log("Result :", result.finalOutput);
}

main("write a code in javascript to add two numbers");
