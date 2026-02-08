import { generateText } from "ai"
import google from "@/lib/model"

export const POST = async() => {
  const response = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: "You are a professional chef. Write a vegetarian lasagna recipe for 4 people in 3-5 sentences"
  })

  return new Response(response.text)
}