"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import {
  Authenticated,
  AuthLoading,
  ConvexReactClient,
  Unauthenticated
} from "convex/react"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import { ClerkProvider, useAuth } from "@clerk/nextjs"
import { shadcn } from "@clerk/themes"
import UnauthenticatedView from "./auth/unauthenticated-view"
import AuthLoadingView from "./auth/auth-loading-view"

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in your .env file")
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

export function Provider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ClerkProvider appearance={{ theme: shadcn }}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <Authenticated>{children}</Authenticated>
          <Unauthenticated>
            <UnauthenticatedView />
          </Unauthenticated>
          <AuthLoading>
            <AuthLoadingView />
          </AuthLoading>
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </NextThemesProvider>
  )
}
