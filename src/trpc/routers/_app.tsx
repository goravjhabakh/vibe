import { z } from 'zod'
import { baseProcedure, createTRPCRouter } from '../init'
import { inngest } from '@/inngest/client'

export const appRouter = createTRPCRouter({
  invoke: baseProcedure.input(z.object({
    prompt: z.string()
  })).mutation(async ({ input }) => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        prompt: input.prompt
      }
    })
    return { ok: "success" }
  }),

  hello: baseProcedure.input(z.object({
    text: z.string()
  })).query((opts) => {
    return { greeting: `Hello ${opts.input.text}!` }
  })
})

export type AppRouter = typeof appRouter