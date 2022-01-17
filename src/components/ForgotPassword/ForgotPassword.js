import React, { useState } from "react"
import { Container, Form, Button, Spinner } from "react-bootstrap"
import AlertWithMessage from "../Alert/AlertWithMessage"
import axios from "axios"
import {
  HTTP_API,
  SEND_FORGOT_PASSWORD_EMAIL_ENDPOINT,
} from "../../constants/constants"

export default function ForgotPassword() {
  const [email, setEmail] = useState()
  const [operationStatus, setOperationStatus] = useState({
    variant: undefined,
    show: false,
    message: undefined,
  })
  const [isWaitingResponse, setIsWaitingResponse] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }

      const body = JSON.stringify({
        email,
      })

      setIsWaitingResponse(true)
      await axios.post(
        `${HTTP_API}/${SEND_FORGOT_PASSWORD_EMAIL_ENDPOINT}`,
        body,
        config
      )

      setOperationStatus({
        variant: "success",
        show: true,
        message: "Email de recuperação de senha enviado, verifique a caixa de spam.",
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
        <h1>Recuperação de senha</h1>
        <AlertWithMessage
          {...operationStatus}
          setShow={(value) =>
            setOperationStatus({ ...operationStatus, show: value })
          }
        />
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder=""
          />
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
            {isWaitingResponse ? " Aguarde..." : "Recuperar senha"}
          </Button>
        </div>
      </Form>
    </Container>
  )
}
