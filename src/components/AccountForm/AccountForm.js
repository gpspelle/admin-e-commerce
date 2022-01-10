import React, { useEffect, useState } from "react"
import axios from "axios"
import { useHistory } from "react-router-dom"
import {
  ACCESS_TOKEN_NAME,
  ACCOUNT_ENDPOINT,
  REST_API,
  HTTP_API,
  SEND_VERIFY_EMAIL_ENDPOINT,
} from "../../constants/constants"
import { Form, Container, Button, Spinner, Modal } from "react-bootstrap"
import PhoneNumberInput from "../PhoneNumberInput/PhoneNumberInput"
import useToken from "../../hooks/useToken"
import AlertWithMessage from "../Alert/AlertWithMessage"
import "./AccountForm.css"

var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})")
const isValidPassword = (password) => strongRegex.test(password)
const isValidPhoneNumber = (phoneNumber) =>
  String(phoneNumber).match(/^\+?[1-9]\d{1,14}$/)

export default function AccountForm(props) {
  const { token } = useToken()
  const history = useHistory()
  const [userData, setUserData] = useState(props)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [createEditAccountBackendMessage, setCreateEditAccountBackendMessage] =
    useState()
  const [isWaitingResponse, setIsWaitingResponse] = useState(false)
  const [alertVariant, setAlertVariant] = useState()
  const [showModal, setShowModal] = useState(false)
  const [isPropsSet, setIsPropsSet] = useState(false)
  const handleCloseModal = () => setShowModal(false)
  const handleShowModal = () => setShowModal(true)

  const { email, name, commercialName, phoneNumber, isEmailVerified } = userData
  useEffect(() => {
    if (Object.keys(props).length > 0) {
      setIsPropsSet(true)
      setUserData(props)
    }
  }, [props])

  const isCreateInputValid = () => {
    return (
      email !== "" &&
      name !== "" &&
      commercialName !== "" &&
      phoneNumber !== "" &&
      isValidPhoneNumber(phoneNumber) &&
      password !== "" &&
      isValidPassword(password)
    )
  }

  const isEditInputValid = () => {
    return (
      email !== "" &&
      name !== "" &&
      commercialName !== "" &&
      phoneNumber !== "" &&
      isValidPhoneNumber(phoneNumber)
    )
  }

  const isEditPasswordInputValid = () => {
    return (
      email !== "" &&
      newPassword !== "" &&
      isValidPassword(newPassword) &&
      oldPassword !== "" &&
      isValidPassword(oldPassword)
    )
  }

  async function handleCreateAccount(event) {
    event.preventDefault()
    setShow(false)
    if (!isCreateInputValid()) {
      return
    }

    const body = JSON.stringify({
      email,
      name,
      commercialName,
      phoneNumber,
      password,
    })

    var config = {
      headers: { "Content-Type": "application/json" },
    }

    try {
      await axios.put(`${REST_API}/${ACCOUNT_ENDPOINT}`, body, config)
      history.push({ pathname: "/", state: { email: email } })
    } catch (error) {
      setAlertVariant("danger")
      setCreateEditAccountBackendMessage(error?.response?.data?.message)
      setShow(true)
    }
  }

  async function handleEditAccount(event) {
    event.preventDefault()
    setShow(false)
    if (!isEditInputValid()) {
      return
    }

    if (props.email !== email) {
      // we still do not allow change of email as it is
      // the partition key of the admins table
      return
    }

    const body = { email: props.email }

    if (props.name !== name) body.name = name
    if (props.commercialName !== commercialName)
      body.commercial_name = commercialName
    if (props.phoneNumber !== phoneNumber) body.phone_number = phoneNumber

    if (Object.keys(body).length === 1) {
      return
    }

    var config = {
      headers: {
        "Content-Type": "application/json",
        [ACCESS_TOKEN_NAME]: token,
      },
    }

    try {
      setIsWaitingResponse(true)
      const response = await axios.patch(
        `${REST_API}/${ACCOUNT_ENDPOINT}`,
        JSON.stringify(body),
        config
      )
      setAlertVariant("success")
      setCreateEditAccountBackendMessage(response.data.message)
    } catch (error) {
      setAlertVariant("danger")
      setCreateEditAccountBackendMessage(error.response.data.message)
    } finally {
      setShow(true)
      setIsWaitingResponse(false)
    }
  }

  async function handleEditPasswordAccount(event) {
    event.preventDefault()
    setShow(false)
    if (!isEditPasswordInputValid()) {
      return
    }

    if (props.email !== email) {
      // we still do not allow change of email as it is
      // the partition key of the admins table
      return
    }

    const body = {
      email: props.email,
      oldPassword,
      newPassword,
    }

    var config = {
      headers: {
        "Content-Type": "application/json",
        [ACCESS_TOKEN_NAME]: token,
      },
    }

    try {
      setIsWaitingResponse(true)
      handleCloseModal()
      const response = await axios.patch(
        `${REST_API}/${ACCOUNT_ENDPOINT}`,
        JSON.stringify(body),
        config
      )
      setAlertVariant("success")
      setCreateEditAccountBackendMessage(response.data.message)
    } catch (error) {
      setAlertVariant("danger")
      setCreateEditAccountBackendMessage(error.response.data.message)
    } finally {
      setShow(true)
      setIsWaitingResponse(false)
      setOldPassword("")
      setNewPassword("")
    }
  }

  async function sendVerificationEmail() {
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    const body = JSON.stringify({
      email,
      name,
    })

    try {
      setIsWaitingResponse(true)
      const response = await axios.post(
        `${HTTP_API}/${SEND_VERIFY_EMAIL_ENDPOINT}?${ACCESS_TOKEN_NAME}=${token}`,
        body,
        config
      )
      setAlertVariant("success")
      setCreateEditAccountBackendMessage(response.data.body.message)
    } catch (error) {
      setAlertVariant("danger")
      setCreateEditAccountBackendMessage(error.response.data.body.message)
    } finally {
      setShow(true)
      setIsWaitingResponse(false)
    }
  }

  return (
    <div>
      {isPropsSet && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Alterar senha</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formChangeAccountOldPassword">
              <Form.Label>Senha antiga</Form.Label>
              <Form.Control
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                type="password"
                placeholder=""
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formChangeAccountNewPassword">
              <Form.Label>Senha nova</Form.Label>
              <Form.Control
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                placeholder=""
              />
              <ol type="I">
                <li>Pelo menos 8 (oito) caracteres</li>
                <li>Pelo menos uma letra minúscula</li>
                <li>Pelo menos uma letra maiúscula</li>
                <li>Pelo menos um número</li>
              </ol>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleEditPasswordAccount}>
              Alterar senha
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <Form onSubmit={isPropsSet ? handleEditAccount : handleCreateAccount}>
          <h1>{isPropsSet ? `Bem vindo, ${props.name}` : "Crie uma nova conta"}</h1>
          <AlertWithMessage
            variant={alertVariant}
            show={show}
            setShow={setShow}
            message={createEditAccountBackendMessage}
          />
          <Form.Group className="mb-3" controlId="formCreateAccountEmail">
            <Form.Label>Email</Form.Label>
            {isPropsSet &&
              (isEmailVerified ? (
                <div>
                  <span className="verified-email">&#x2705; Email verificado</span>
                </div>
              ) : (
                <div>
                  <span>&#x2757; Email não verificado,</span>
                  <span
                    className="resend-verification-email"
                    onClick={sendVerificationEmail}
                  >
                    {" "}
                    clique aqui para reenviar o email de verificação &rsaquo;
                  </span>
                </div>
              ))}
            <Form.Control
              disabled={isPropsSet ? true : false}
              value={email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              type="email"
              placeholder="gabriel@gmail.com"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCreateAccountFullName">
            <Form.Label>Nome completo</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              type="text"
              placeholder="Gabriel da Silva"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCreateAccountCommercialName">
            <Form.Label>Nome comercial</Form.Label>
            <Form.Control
              value={commercialName}
              onChange={(e) =>
                setUserData({ ...userData, commercialName: e.target.value })
              }
              type="text"
              placeholder="Ateliê do Gabriel"
            />
          </Form.Group>
          <PhoneNumberInput
            phoneNumber={phoneNumber}
            userData={userData}
            setUserData={setUserData}
          />
          {isPropsSet ? (
            <Form.Group className="mb-3" controlId="formEditAccountPassword">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                disabled={true}
                value={"password_placeholder_not_real"}
                type="password"
                placeholder=""
              />
              <Button
                variant="outline-primary"
                className="w-100 my-2"
                onClick={handleShowModal}
              >
                Alterar senha
              </Button>
            </Form.Group>
          ) : (
            <Form.Group className="mb-3" controlId="formCreateAccountPassword">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder=""
              />
              <ol type="I">
                <li>Pelo menos 8 (oito) caracteres</li>
                <li>Pelo menos uma letra minúscula</li>
                <li>Pelo menos uma letra maiúscula</li>
                <li>Pelo menos um número</li>
              </ol>
            </Form.Group>
          )}
          <Button
            type="submit"
            variant="primary"
            className="w-100"
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
            {isWaitingResponse
              ? " Aguarde..."
              : isPropsSet
              ? "Atualizar perfil"
              : "Criar conta"}
          </Button>
        </Form>
      </Container>
    </div>
  )
}
