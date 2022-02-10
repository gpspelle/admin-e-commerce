import React, { useState, useEffect } from "react"
import { Container } from "react-bootstrap"

import useToken from "../../hooks/useToken"
import { getAccountFromDatabase } from "../../actions/database"

export default function Home() {
  const { token } = useToken()
  const [userData, setUserData] = useState({
    name: undefined,
  })

  useEffect(() => {
    getAccountFromDatabase({ token, setUserData, attributesFromAccount: ["name"] })
  }, [token])

  const { name } = userData
  return (
    <Container
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div style={{ paddingBottom: "20px" }}>Olá, {name}!</div>
      Bem vindo ao sistema de administração, utilize o menu para navegar.
    </Container>
  )
}
