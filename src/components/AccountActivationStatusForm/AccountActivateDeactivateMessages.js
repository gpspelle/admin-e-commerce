import React from "react"

export const DeactivateAccountModalMessage = `Ao desativar a sua conta, os seus produtos e a sua conta não estarão mais visíveis na plataforma.
 Você poderá no futuro reativar a sua conta.`

export const ActivateAccountModalMessage = `Ao reativar a sua conta, os seus produtos e a sua conta serão visíveis na plataforma.
 Você poderá no futuro desativar a sua conta.`

export const ActivateAccount = () => {
  return (
    <p style={{ whiteSpace: "pre-line" }}>
      {`Ficaremos muito felizes em tê-lo de volta na loja.
      \n Para reativar a sua conta, clique no botão abaixo.`}
    </p>
  )
}

export const DeactivateAccount = () => {
  return (
    <p style={{ whiteSpace: "pre-line" }}>
      {`Para desativar a sua conta, clique no botão abaixo.`}
    </p>
  )
}
