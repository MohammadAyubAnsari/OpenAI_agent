import "dotenv/config";
import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";
import fs from "node:fs/promises";

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

const refundAgent = new Agent({
  name: "Refund Agent",
  instructions: "You are an expert in issuing refunds .",
  tools: [processRefund],
});

const sales_agent = new Agent({
  name: "sales_agent",
  instructions:
    "You are an expert sales agent for an internet broadband company.Talk to the user and help them with what they need.",
  tools: [
    fetchAvailablePlans,
    refundAgent.asTool({
      toolName: "refund_expert",
      toolDescription: "Handles refund questions and requests.",
    }),
  ],
});

async function runAgent(query = "") {
  const result = await run(sales_agent, query);
  console.log(result.finalOutput);
}

runAgent(
  `I had a plan 399. I need only refund right now. My customer id is 123 because I am shifting to a new place`,
);
