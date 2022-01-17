import React, { useState } from "react"
import { Container, Form, Button, Spinner } from "react-bootstrap"
import AlertWithMessage from "../Alert/AlertWithMessage"
import axios from "axios"
import {
  REST_API,
  ACCESS_TOKEN_NAME,
  ACCOUNT_ENDPOINT,
} from "../../constants/constants"
import useQuery from "../../hooks/useQuery"
import PasswordRequirements from "../PasswordRequirements/PasswordRequirements"

export default function ChangeForgotPassword() {
  const query = useQuery()
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          [ACCESS_TOKEN_NAME]: token,
        },
      }

      const body = JSON.stringify({
        email,
        password,
      })

      setIsWaitingResponse(true)
      await axios.patch(`${REST_API}/${ACCOUNT_ENDPOINT}`, body, config)

      setOperationStatus({
        variant: "success",
        show: true,
        message: "Senha alterada com sucesso.",
      })
    } catch (error) {
      setOperationStatus({
        variant: "danger",
        show: true,
        message: error?.response?.data?.message,
      })
    } finally {
      setIsWaitingResponse(false)
    }
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
      <Form onSubmit={handleSubmit}>
        <h1>Alterar senha</h1>
        <AlertWithMessage
          {...operationStatus}
          setShow={(value) =>
            setOperationStatus({ ...operationStatus, show: value })
          }
        />
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
          <Button type="submit" variant="primary" disabled={isWaitingResponse}>
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
      </Form>
    </Container>
  )
}
