import React from "react"
import { Alert } from "react-bootstrap"

export default function DeleteAlert({ show, setShow, status, deletedProductName }) {
  const alertMessageAndType = {}

  if (status >= 200 && status <= 300) {
    alertMessageAndType.variant = "success"
    alertMessageAndType.Heading = `O produto ${deletedProductName} foi deletado com sucesso.`
  } else {
    alertMessageAndType.variant = "danger"
    alertMessageAndType.Heading = `O produto ${deletedProductName} não foi deletado corretamente, tente novamente.`
  }

  if (show) {
    return (
      <Alert
        variant={alertMessageAndType.variant}
        onClose={() => setShow(false)}
        dismissible
      >
        <Alert.Heading>{alertMessageAndType.Heading}</Alert.Heading>
      </Alert>
    )
  }

  return null
}
