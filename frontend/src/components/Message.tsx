import { PropsWithChildren } from "react"
import { Alert } from "react-bootstrap"

interface MessageProps {
  variant?: string
}

export const Message = ({
  variant = "info",
  children,
}: PropsWithChildren<MessageProps>) => {
  return <Alert variant={variant}>{children}</Alert>
}
