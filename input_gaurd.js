import "dotenv/config";
import { Agent, run, InputGuardrailTripwireTriggered } from "@openai/agents";
import { z } from "zod";

const mathInputAgent = new Agent({
  name: "Maths query checker",
  instructions: `You are an input guardrail agent that checks if the query is a math question ot not.
  Rules:
  - The question has to be strictly a maths equation only.
  - Reject any other kind of request even if related to maths.
  `,
  outputType: z.object({
    isValidMathsQuestion: z
      .boolean()
      .describe("if the question is a maths question?"),
    reason: z.string().optional().describe("reason for rejection"),
  }),
});

const mathInputGuardrail = {
  name: "Math Homework Guardrail",
  execute: async ({ input }) => {
    console.log(`TODO:We need to validate ${input}`);
    const result = await run(mathInputAgent, input);
    return {
      outputInfo: result.finalOutput.reason,
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

main("what is 2+10*13//2");
