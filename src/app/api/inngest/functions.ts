import { inngest } from "@/inngest/client";
import google from "@/lib/model";
import { generateText } from "ai";

export const demoGenerate = inngest.createFunction(
  { id: "demo-generate" },
  { event: "demo/generate" },
  async ({ step }) => {
    await step.run("generate-text", async () => {
      const response = await generateText({
        model: google("gemini-2.5-flash"),
        prompt: "You are a professional chef. Write a vegetarian lasagna recipe for 4 people in 3-5 sentences"
      })
      return response.text
    })
  }
)