import "dotenv/config";
import { Agent, run, InputGuardrailTripwireTriggered } from "@openai/agents";
import { z } from "zod";

const mathInputAgent = new Agent({
  name: "Maths query checker",
  instructions:
    "You are an input guardrail agent that checks if the query is a math question ot not.",
  outputType: z.object({
    isValidMathsQuestion: z
      .boolean()
      .describe("if the question is a maths question?"),
  }),
});

const mathInputGuardrail = {
  name: "Math Homework Guardrail",
  execute: async ({ input }) => {
    console.log(`TODO:We need to validate ${input}`);
    const result = await run(mathInputAgent, input);
    return {
      tripwireTriggered: !result.finalOutput.isValidMathsQuestion,
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

main("write a poem to my crush ");
