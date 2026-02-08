"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

const Page = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)

  const handleBlocking = async () => {
    setLoading(true)
    await fetch("/api/demo/blocking", { method: "POST" })
    setLoading(false)
  }

  const handleBackground = async () => {
    setLoading2(true)
    await fetch("/api/demo/background", { method: "POST" })
    setLoading2(false)
  }

  return (
    <div className="flex gap-4 p-10">
      <Button onClick={handleBlocking} disabled={loading}>
        Blocking
      </Button>
      <Button onClick={handleBackground} disabled={loading2}>
        Background
      </Button>
    </div>
  )
}
export default Page
