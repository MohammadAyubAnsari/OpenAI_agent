import "dotenv/config";
import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";
import axios from "axios";
import nodemailer from "nodemailer";

const getWeatherTool = tool({
  name: "get_weather",
  description: "returns the current weather information for the given city",
  parameters: z.object({
    city: z.string().describe("The name of the city to get the weather for"),
  }),
  execute: async ({ city }) => {
    const url = `https://wttr.in/${city.toLowerCase()}?format=%C+%t`;
    const response = await axios.get(url, { responseType: "text" });
    return `The weather of ${city} is ${response.data}`;
  },
});

const sendEmailTool = tool({
  name: "send_email",
  description: "This tool sends an email ",
  parameters: z.object({
    email: z.string().describe("The email address to send the email to"),
    subject: z.string().describe("The subject of the email"),
    body: z.string().describe("The body of the email"),
  }),
  execute: async ({ email, subject, body }) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        text: body,
      });

      return `Email sent successfully to ${email}. Message ID: ${info.messageId}`;
    } catch (error) {
      console.error(error);

      return `Failed to send email to ${email}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`;
    }
  },
});

const agent = new Agent({
  name: "Weather Agent",
  instructions: `You are an expert weather agent that helps user to tell weather report and send the received report in mail.`,
  tools: [getWeatherTool, sendEmailTool],
});

async function main(query = "") {
  const result = await run(agent, query);
  console.log(`Result:`, result.finalOutput);
}

main(
  `What is the weather of Cuttack, KEndrapara,Kashmir and send the email to mdayubansari2014@gmail.com`,
);
