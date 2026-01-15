import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },
  async ({ event, step }) => {
    await step.sleep("generating-plan", "5s")
    await step.sleep("designing-project-structrue", "3s")
    await step.sleep("implementing-project", "10s")
    await step.sleep("testing-project", "2s")
    return { message: `Hello ${event.data.name}` }
  }
)