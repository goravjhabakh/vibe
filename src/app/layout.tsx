import type { Metadata } from "next"
import "./globals.css"
import { Provider } from "@/components/provider"

export const metadata: Metadata = {
  title: "Vibe",
  description: "Web AI Code Editor"
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Provider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </Provider>
      </body>
    </html>
  )
}
