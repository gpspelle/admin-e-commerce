import React, { useState } from "react"
import { Container, Form, Button, Spinner } from "react-bootstrap"
import { useHistory } from "react-router-dom"

import useQuery from "../../hooks/useQuery"
import AlertWithMessage from "../Alert/AlertWithMessage"
import { ACCESS_TOKEN_NAME } from "../../constants/constants"
import PasswordRequirements from "../PasswordRequirements/PasswordRequirements"
import { patchAccountOnDatabase } from "../../actions/database"

const successMessage = "Senha alterada com sucesso."

export default function ChangeForgotPassword() {
  const query = useQuery()
  const history = useHistory()
  const [password, setPassword] = useState()
  const [passwordShown, setPasswordShown] = useState(false)
  const [operationStatus, setOperationStatus] = useState({
    variant: undefined,
    show: false,
    message: undefined,
  })
  const [isWaitingResponse, setIsWaitingResponse] = useState(false)

  const token = query.get(ACCESS_TOKEN_NAME)
  const email = query.get("email")

  const togglePassword = () => {
    setPasswordShown(!passwordShown)
  }

  const handleChangeForgotPassword = async (event) => {
    event.preventDefault()

    patchAccountOnDatabase({
      token,
      setIsWaitingResponse,
      setOperationStatus,
      bodyAttributes: { email, password },
      successMessage: "Senha alterada com sucesso",
    })
  }

  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <Form onSubmit={handleChangeForgotPassword}>
        <h1>Alterar senha</h1>
        <AlertWithMessage
          {...operationStatus}
          setShow={(value) =>
            setOperationStatus({ ...operationStatus, show: value })
          }
        />
        {operationStatus.message === successMessage ? (
          <Button className="w-100" onClick={() => history.push("/")}>
            Voltar para a tela inicial
          </Button>
        ) : (
          <div>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Nova senha</Form.Label>
              <Form.Control
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={passwordShown ? "text" : "password"}
                placeholder=""
              />
              <Form.Check
                className="my-2"
                type="checkbox"
                label="Mostrar senha"
                onChange={togglePassword}
              />
              <PasswordRequirements password={password} />
            </Form.Group>
            <div style={{ justifyContent: "right", display: "flex" }}>
              <Button
                type="submit"
                className="no-border secondary-background"
                disabled={isWaitingResponse}
              >
                {isWaitingResponse && (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span className="visually-hidden">Aguarde...</span>
                  </>
                )}
                {isWaitingResponse ? " Aguarde..." : "Alterar senha"}
              </Button>
            </div>
          </div>
        )}
      </Form>
    </Container>
  )
}
