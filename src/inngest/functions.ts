import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit"

export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },
  async ({ event }) => {
    const codeAgent = createAgent({
      model: gemini({ model: "gemini-2.5-flash" }),
      name: "code-agent",
      system: "You are an expert next.js developer. You write readable and maintanable code. You write simple next.js and react snippets"
    })

    const { output } = await codeAgent.run(`Write the following snippet: ${event.data.prompt}`)
    console.log(output)
    return { success: "ok" }
  }
)