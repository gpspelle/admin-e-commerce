import React, { useEffect, useState } from "react"
import { Container, Modal, Button, Row, Col, Spinner } from "react-bootstrap"
import useToken from "../../hooks/useToken"
import jwt from "jwt-decode"
import {
  ActivateAccount,
  ActivateAccountModalMessage,
  DeactivateAccount,
  DeactivateAccountModalMessage,
} from "./AccountActivateDeactivateMessages"
import AlertWithMessage from "../Alert/AlertWithMessage"
import { getAccountFromDatabase } from "../../actions/database"
import { deactivateAccountAndProducts } from "../../actions/deactivateAccountAndProducts"
import { activateAccountAndProducts } from "../../actions/activateAccountAndProducts"
import { useHistory } from "react-router-dom"

export default function AccountActivationStatusForm() {
  const history = useHistory()
  const [showModal, setShowModal] = useState(false)
  const [operationStatus, setOperationStatus] = useState({
    show: undefined,
    message: undefined,
    variant: undefined,
  })
  const [userData, setUserData] = useState({
    email: undefined,
  })
  const handleCloseModal = () => setShowModal(false)
  const handleShowModal = () => setShowModal(true)
  const [isWaitingResponse, setIsWaitingResponse] = useState(false)
  const { token, setToken } = useToken()
  var is_active
  var id
  if (token) {
    const decoded = jwt(token)
    is_active = decoded.is_active
    id = decoded.id
  }

  useEffect(() => {
    getAccountFromDatabase({ token, setUserData, attributesFromAccount: ["email"] })
  }, [token])

  const handleEditAccountActivationStatus = async (event) => {
    event.preventDefault()

    setIsWaitingResponse(true)
    handleCloseModal()

    if (is_active) {
      deactivateAccountAndProducts({
        token,
        setToken,
        setOperationStatus,
        setIsWaitingResponse,
        email: userData.email,
        is_active,
      })
    } else {
      activateAccountAndProducts({
        token,
        setToken,
        setOperationStatus,
        setIsWaitingResponse,
        email: userData.email,
        is_active,
        id,
        history,
      })
    }
  }

  const textInstruction = is_active ? "Desativar conta" : "Ativar conta"
  const message = is_active ? <DeactivateAccount /> : <ActivateAccount />
  const modalMessage = is_active
    ? DeactivateAccountModalMessage
    : ActivateAccountModalMessage

  return (
    <>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>{textInstruction}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            disabled={isWaitingResponse}
            onClick={handleCloseModal}
          >
            Cancelar
          </Button>
          <Button
            variant={is_active ? "danger" : "success"}
            disabled={isWaitingResponse}
            onClick={handleEditAccountActivationStatus}
          >
            {textInstruction}
          </Button>
        </Modal.Footer>
      </Modal>
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <Row>
          <Col>
            <AlertWithMessage
              {...operationStatus}
              setShow={(value) =>
                setOperationStatus({ ...operationStatus, show: value })
              }
            />
            {message}
            <Button
              variant={is_active ? "danger" : "success"}
              className="w-100"
              disabled={isWaitingResponse || userData.email === undefined}
              onClick={handleShowModal}
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
              {isWaitingResponse ? " Aguarde..." : textInstruction}
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  )
}
