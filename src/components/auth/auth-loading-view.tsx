import { Spinner } from "../ui/spinner"

const AuthLoadingView = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <Spinner className="size-5" />
    </div>
  )
}
export default AuthLoadingView
