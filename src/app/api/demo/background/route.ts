import { inngest } from "@/inngest/client"

export const POST = async() => {
  await inngest.send({
    name: "demo/generate",
    data: {}
  })

  return Response.json({ status: "started" })
}