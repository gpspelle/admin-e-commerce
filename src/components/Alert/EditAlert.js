import React from "react"
import { Alert } from "react-bootstrap"

export default function EditAlert({
  show,
  setShow,
  status,
  editedProductName,
  newEditedProductName,
}) {
  const alertMessageAndType = {}

  if (status >= 200 && status <= 300) {
    alertMessageAndType.variant = "success"
    alertMessageAndType.Heading = `O produto ${editedProductName} foi deletado com sucesso.`
  } else {
    alertMessageAndType.variant = "danger"
    alertMessageAndType.Heading = `O produto anteriormente chamado de ${editedProductName}, com novo nome de ${newEditedProductName} não foi alterado corretamente, tente novamente.`
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
