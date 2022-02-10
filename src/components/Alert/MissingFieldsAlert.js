import React from "react"
import { Alert } from "react-bootstrap"

import { productTypes } from "../ProductType/ProductType"

const getMissingRequiredFields = (
  name,
  description,
  price,
  images,
  productType,
  dealPrice,
  lightingDealStartTime
) => {
  let missingRequiredFields = ""

  if (name === "") {
    missingRequiredFields += "nome, "
  }

  if (description === "") {
    missingRequiredFields += "descrição, "
  }

  if (price === "") {
    missingRequiredFields += "preço, "
  }

  if (!images || images.length === 0) {
    missingRequiredFields += "ao menos uma imagem, "
  }

  if (productType === productTypes.DEAL.name) {
    if (dealPrice === "") {
      missingRequiredFields += "preço promocional, "
    }
  }

  if (productType === productTypes.LIGHTING_DEAL.name) {
    if (dealPrice === "") {
      missingRequiredFields += "preço promocional (oferta relâmpago), "
    }

    const now = new Date()
    if (now > new Date(lightingDealStartTime)) {
      missingRequiredFields +=
        "o início da oferta relâmpago não pode ser no passado, "
    }
  }

  return missingRequiredFields.substring(0, missingRequiredFields.length - 2)
}

export default function MissingFieldsAlert({
  show,
  setShow,
  name,
  description,
  price,
  images,
  productType,
  dealPrice,
  lightingDealStartTime,
}) {
  const missingRequiredFields = getMissingRequiredFields(
    name,
    description,
    price,
    images,
    productType,
    dealPrice,
    lightingDealStartTime
  )
  if (missingRequiredFields.length === 0) {
    setShow(false)
  }

  if (show) {
    return (
      <Alert variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>
          Os seguintes campos são obrigatórios: {missingRequiredFields}
        </Alert.Heading>
      </Alert>
    )
  }

  return null
}
