import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import axios from "axios"
import { useHistory, useLocation } from "react-router-dom"
import { REST_API, CREATE_ACCOUNT, LOGIN_ENDPOINT } from "../../constants/constants"
import { Form, Button, Container } from "react-bootstrap"
import AlertWithMessage from "../Alert/AlertWithMessage"

export default function Login({ setToken }) {
  const history = useHistory()
  const location = useLocation()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [show, setShow] = useState()
  const [loginStatusMessage, setLoginStatusMessage] = useState(false)

  useEffect(() => {
    if (location.state) {
      setEmail(location.state.email)
    }
  }, [location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setShow(false)

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }

      const body = JSON.stringify({
        email,
        password,
      })

      const res = await axios.post(`${REST_API}/${LOGIN_ENDPOINT}`, body, config)
      setToken(res.data)
    } catch (error) {
      setLoginStatusMessage(error.response.data)
      setShow(true)
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
        <h1>Bem vindo</h1>
        <AlertWithMessage
          variant="danger"
          show={show}
          setShow={setShow}
          message={loginStatusMessage}
        />
        <Button
          onClick={() => history.push(`/${CREATE_ACCOUNT}`)}
          className="w-100 my-2"
          variant="outline-success"
        >
          Criar nova conta
        </Button>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder=""
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder=""
          />
        </Form.Group>
        <div style={{ justifyContent: "right", display: "flex" }}>
          <Button variant="primary" type="submit">
            Enviar
          </Button>
        </div>
      </Form>
    </Container>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
}
