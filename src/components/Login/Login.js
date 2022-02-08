import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { useHistory, useLocation } from "react-router-dom"
import { CREATE_ACCOUNT, FORGOT_PASSWORD } from "../../constants/constants"
import { Form, Button, Container } from "react-bootstrap"
import AlertWithMessage from "../Alert/AlertWithMessage"
import { postLogin } from "../../actions/database"

export default function Login({ setToken }) {
  const history = useHistory()
  const location = useLocation()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [show, setShow] = useState()
  const [loginStatusMessage, setLoginStatusMessage] = useState(false)
  const [passwordShown, setPasswordShown] = useState(false)

  const togglePassword = () => {
    setPasswordShown(!passwordShown)
  }

  useEffect(() => {
    if (location.state) {
      setEmail(location.state.email)
    }
  }, [location])

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    postLogin({
      email,
      password,
      setToken,
      setLoginStatusMessage,
      setShow,
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
      <Form onSubmit={handleLoginSubmit}>
        <h1>Bem vindo</h1>
        <AlertWithMessage
          variant="danger"
          show={show}
          setShow={setShow}
          message={loginStatusMessage}
        />
        <Button
          onClick={() => history.push(`/${CREATE_ACCOUNT}`)}
          className="w-100 my-5"
          variant="success"
        >
          Ainda não tem conta? Clique aqui!
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
        </Form.Group>
        <div style={{ justifyContent: "right", display: "flex" }}>
          <Button variant="primary" type="submit">
            Fazer login
          </Button>
        </div>
        <hr
          style={{
            color: "gray",
            backgroundColor: "gray",
            height: 1,
          }}
        />
        <div
          onClick={() => history.push(`/${FORGOT_PASSWORD}`)}
          style={{
            justifyContent: "center",
            display: "flex",
            cursor: "pointer",
            marginTop: "22px",
            color: "#0b5ed7",
            fontWeight: "bold",
          }}
        >
          Esqueceu a senha?
        </div>
      </Form>
    </Container>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
}
