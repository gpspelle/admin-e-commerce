import React from "react"
import { Alert } from "react-bootstrap"

export default function AlertWithMessage({ variant, show, setShow, message }) {
  if (show) {
    return (
      <Alert variant={variant} onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{message}</Alert.Heading>
      </Alert>
    )
  }

  return null
}
