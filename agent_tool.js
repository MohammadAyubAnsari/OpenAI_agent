import "dotenv/config";
import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";

const getWeatherTool = tool({
  name: "get_weather",
  description: "returns the current weather information for the given city",
  parameters: z.object({
    city: z.string().describe("The name of the city to get the weather for"),
  }),
  execute: async ({ city }) => {
    // Replace this with API call to a real weather service
    return `The weather of ${city} is 25°C.`;
  },
});

const agent = new Agent({
  name: "Weather Agent",
  instructions: `You are an expert weather agent that helps user to tell weather report.`,
  tools: [getWeatherTool],
});

async function main(query = "") {
  const result = await run(agent, query);
  console.log(`Result:`, result.finalOutput);
}

main(`What is the weather of Cuttack`);
