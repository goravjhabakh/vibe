import type { Metadata } from "next"
import "./globals.css"
import { Provider } from "@/components/provider"
import { Inter, IBM_Plex_Mono } from "next/font/google"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"]
})

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

export const metadata: Metadata = {
  title: "Vibe",
  description: "Web AI Code Editor"
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased ${inter.variable} ${plexMono.variable}`}>
        <Provider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </Provider>
      </body>
    </html>
  )
}
