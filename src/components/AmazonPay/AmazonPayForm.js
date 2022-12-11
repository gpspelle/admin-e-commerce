import React, { useEffect, useState } from "react"
import axios from "axios"
import { Form, Container, Button, Spinner, Modal } from "react-bootstrap"

import useToken from "../../hooks/useToken"
import {
  ACCESS_TOKEN_NAME,
  ACCOUNT_ENDPOINT,
  AMAZON_PAY_ENDPOINT,
  REST_API,
} from "../../constants/constants"
import AlertWithMessage from "../Alert/AlertWithMessage"

export default function AmazonPayForm(props) {
  const { token } = useToken()
  const [userData, setUserData] = useState({
    email: props.email,
    name: props.name,
    amazon_pay_private_key: props.amazon_pay_private_key,
    amazon_pay_public_key: props.amazon_pay_public_key,
    amazon_pay_store_id: props.amazon_pay_store_id,
  })

  const [isWaitingResponseUpdate, setIsWaitingResponseUpdate] = useState(false)
  const [isWaitingResponseSignature, setIsWaitingResponseSignature] = useState(false)
  const [operationStatus, setOperationStatus] = useState({
    show: false,
    message: undefined,
    variant: undefined,
  })

  const {
    email,
    amazon_pay_private_key,
    amazon_pay_public_key,
    amazon_pay_store_id,
  } = userData

  useEffect(() => {
    if (Object.keys(props).length > 0) {
      setUserData(props)
    }
  }, [props])

  async function handleEditAccount(event) {
    event.preventDefault()

    if (props.email !== email) {
      // we still do not allow change of email as it is
      // the partition key of the admins table
      return
    }

    const body = { email: props.email }

    if (props.amazon_pay_private_key !== amazon_pay_private_key)
      body.amazon_pay_private_key = amazon_pay_private_key

    if (props.amazon_pay_public_key !== amazon_pay_public_key)
      body.amazon_pay_public_key = amazon_pay_public_key

    if (props.amazon_pay_store_id !== amazon_pay_store_id)
      body.amazon_pay_store_id = amazon_pay_store_id

    if (Object.keys(body).length === 1) {
      return
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        [ACCESS_TOKEN_NAME]: token,
      },
    }

    try {
      setIsWaitingResponseUpdate(true)
      const response = await axios.patch(
        `${REST_API}/${ACCOUNT_ENDPOINT}`,
        JSON.stringify(body),
        config
      )

      setOperationStatus({
        variant: "success",
        message: response?.data?.message,
        show: true,
      })
    } catch (error) {
      setOperationStatus({
        variant: "danger",
        message: error?.response?.data?.message,
        show: true,
      })
    } finally {
      setIsWaitingResponseUpdate(false)
    }
  }

  async function handleAmazonPaySignature(event) {
    event.preventDefault()

    const body = { email: props.email }

    const config = {
      headers: {
        "Content-Type": "application/json",
        [ACCESS_TOKEN_NAME]: token,
      },
    }

    try {
      setIsWaitingResponseSignature(true)
      const response = await axios.post(
        `${REST_API}/${AMAZON_PAY_ENDPOINT}`,
        JSON.stringify(body),
        config
      )

      console.log(response)

      setOperationStatus({
        variant: "success",
        message: response?.data?.message,
        show: true,
      })
    } catch (error) {
      setOperationStatus({
        variant: "danger",
        message: error?.response?.data?.message,
        show: true,
      })
    } finally {
      setIsWaitingResponseSignature(false)
    }
  }

  return (
    <div>
      <Container
        style={{
          display: "grid",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <Form onSubmit={handleEditAccount}>
          <h1>Bem vindo, {props.name}</h1>
          <AlertWithMessage
            {...operationStatus}
            setShow={(value) =>
              setOperationStatus({ ...operationStatus, show: value })
            }
          />
          <Form.Group
            className="mb-3"
            controlId="formCreateAccountAmazonPayPrivateKey"
          >
            <Form.Label>Amazon Pay - Private Key (Chave privada) </Form.Label>
            <Form.Control
              value={amazon_pay_private_key}
              onChange={(e) =>
                setUserData({ ...userData, amazon_pay_private_key: e.target.value })
              }
              as="textarea"
              rows={28}
              placeholder=""
            />
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="formCreateAccountAmazonPayPublicKey"
          >
            <Form.Label>Amazon Pay - Public Key (Chave pública) </Form.Label>
            <Form.Control
              value={amazon_pay_public_key}
              onChange={(e) =>
                setUserData({ ...userData, amazon_pay_public_key: e.target.value })
              }
              type="text"
              placeholder=""
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCreateAccountAmazonPayStoreId">
            <Form.Label>Amazon Pay - Store Id (Identificador da loja) </Form.Label>
            <Form.Control
              value={amazon_pay_store_id}
              onChange={(e) =>
                setUserData({ ...userData, amazon_pay_store_id: e.target.value })
              }
              type="text"
              placeholder=""
            />
          </Form.Group>
          <Button
            type="submit"
            className="w-100 no-border secondary-dark-background"
            disabled={isWaitingResponseUpdate}
          >
            {isWaitingResponseUpdate && (
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
            {isWaitingResponseUpdate ? " Aguarde..." : "Atualizar dados Amazon Pay"}
          </Button>
        </Form>
        <Form onSubmit={handleAmazonPaySignature}>
          <p className="my-2">
            Após inserir os seus dados, clique no botão abaixo para efetuar a mudança
            na sua configuração de pagamento.
          </p>
          <Button
            type="submit"
            className="w-100 no-border helper-success-background"
            disabled={isWaitingResponseSignature}
          >
            {isWaitingResponseSignature && (
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
            {isWaitingResponseSignature ? " Aguarde..." : "Assinar dados Amazon Pay"}
          </Button>
        </Form>
      </Container>
    </div>
  )
}
