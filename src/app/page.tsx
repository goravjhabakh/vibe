import { Button } from "@/components/ui/button"
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton
} from "@clerk/nextjs"

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Vibe</h1>
      <div className="flex items-center justify-between space-x-5 px-5">
        <SignedOut>
          <SignInButton>
            <Button variant={"outline"}>Sign In</Button>
          </SignInButton>
          <SignUpButton>
            <Button>Sign Up</Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
          <SignOutButton>
            <Button variant={"outline"}>Sign Out</Button>
          </SignOutButton>
        </SignedIn>
      </div>
    </div>
  )
}
export default Page
