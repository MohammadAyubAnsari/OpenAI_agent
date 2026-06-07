import "dotenv/config";
import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";

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
    "You are an expert sales agent for an internet broadband company.Talk to the user and help them with what they need.",
  tools: [fetchAvailablePlans],
});

async function runAgent(query = "") {
  const result = await run(sales_agent, query);
  console.log(result.finalOutput);
}

runAgent(`Hey there, I want to know the available plans`);
