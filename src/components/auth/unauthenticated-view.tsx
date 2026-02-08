import { SignInButton } from "@clerk/nextjs"
import { Button } from "../ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from "../ui/item"
import { ShieldAlertIcon } from "lucide-react"

const UnauthenticatedView = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="max-w-lg bg-muted w-full">
        <Item variant={"outline"}>
          <ItemMedia variant={"icon"}>
            <ShieldAlertIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Unauthorized</ItemTitle>
            <ItemDescription>
              You are not authorized to access this resource
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <SignInButton>
              <Button variant={"outline"} size={"sm"}>
                Sign In
              </Button>
            </SignInButton>
          </ItemActions>
        </Item>
      </div>
    </div>
  )
}
export default UnauthenticatedView
