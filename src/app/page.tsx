'use client'

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { useTRPC } from "@/trpc/client"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"

export default function Home() {
  const [prompt, setPrompt] = useState("")

  const trpc = useTRPC()
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess: () => {
      toast.success("Background job invoked successfully")
    },
    onError: () => {
      toast.error("Background job failed")
    }
  }))

  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4">
      <h1 className="text-3xl font-bold">Home</h1>
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-xl"
      />
      <Button disabled={invoke.isPending} onClick={() => { invoke.mutate({ prompt }) }}>
        Invoke Background Job
      </Button>
    </div>
  )
}
