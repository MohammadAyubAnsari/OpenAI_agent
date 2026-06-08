import "dotenv/config";
import { Agent, run, tool } from "@openai/agents";
import { RECOMMENDED_PROMPT_PREFIX } from "@openai/agents-core/extensions";
import { z } from "zod";
import fs from "node:fs/promises";

const processRefund = tool({
  name: "process_refund",
  description: "This tool processes the refund for a customer",
  parameters: z.object({
    customerId: z.string().describe("id of the customer"),
    reason: z.string().describe("reason for refund"),
  }),
  execute: async function ({ customerId, reason }) {
    await fs.appendFile(
      "./refunds.txt",
      `Refund for Customer having ID ${customerId} for ${reason}\n`,
      "utf-8",
    );
    return { refundIssued: true };
  },
});

// Refund Agent
const refundAgent = new Agent({
  name: "Refund Agent",
  instructions: "You are an expert in issuing refunds .",
  tools: [processRefund],
});

// Sales Agent
const fetchAvailablePlans = tool({
  name: "fetch_available_plans",
  description: "fetches the available plan for internet",
  parameters: z.object({}),
  execute: async () => {
    return [
      { plan_id: "1", price_inr: 399, speed: "30 MB/s" },
      { plan_id: "2", price_inr: 699, speed: "100 MB/s" },
      { plan_id: "3", price_inr: 999, speed: "150 MB/s" },
    ];
  },
});

const sales_agent = new Agent({
  name: "sales_agent",
  instructions:
    "{RECOMMENDED_PROMPT_PREFIX}You are an expert sales agent for an internet broadband company.Talk to the user and help them with what they need.",
  tools: [
    fetchAvailablePlans,
    refundAgent.asTool({
      toolName: "refund_expert",
      toolDescription: "Handles refund questions and requests.",
    }),
  ],
});

// Reception Agent
const reception_agent = new Agent({
  name: "Reception Agent",
  instructions:
    "You are the customer facing agent expert in understanding what customer needs and then route them or handoff them to the right Agent.",
  handoffDescription:
    "You have two agents available:                                                          - sales_agent: Expert in handling queries like all plans and pricing available.             Good for new customers.                                                                       - refundAgent: Expert in handling user queries for existing customers and issue refunds and help them.",
  handoffs: [sales_agent, refundAgent],
});

async function main(query = "") {
  const result = await run(reception_agent, query);
  console.log("Result: ", result.finalOutput);
  console.log("History: ", result.history);
}

main(
  "Hey there,I am customer having id 2390 and I want a refund because internet speed is slow.",
);
