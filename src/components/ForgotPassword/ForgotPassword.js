import React, { useState } from "react"
import { Container, Form, Button, Spinner } from "react-bootstrap"

import { postForgotPasswordEmail } from "../../actions/database"
import AlertWithMessage from "../Alert/AlertWithMessage"

export default function ForgotPassword() {
  const [email, setEmail] = useState()
  const [operationStatus, setOperationStatus] = useState({
    variant: undefined,
    show: false,
    message: undefined,
  })
  const [isWaitingResponse, setIsWaitingResponse] = useState(false)

  const handleChangePassword = async (e) => {
    e.preventDefault()

    postForgotPasswordEmail({
      setIsWaitingResponse,
      setOperationStatus,
      email,
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
      <Form onSubmit={handleChangePassword}>
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
