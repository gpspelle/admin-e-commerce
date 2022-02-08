import React, { useEffect, useState } from "react"
import axios from "axios"
import { useHistory } from "react-router-dom"
import {
  ACCESS_TOKEN_NAME,
  ACCOUNT_ENDPOINT,
  REST_API,
  SAME_ORIGINAL_PROFILE_PHOTO_STRING,
} from "../../constants/constants"
import { Form, Container, Button, Spinner, Modal } from "react-bootstrap"
import PhoneNumberInput from "../PhoneNumberInput/PhoneNumberInput"
import useToken from "../../hooks/useToken"
import AlertWithMessage from "../Alert/AlertWithMessage"
import PasswordRequirements from "../PasswordRequirements/PasswordRequirements"
import "./AccountForm.css"
import ProfilePhoto, { rotateMin, zoomMin } from "../ProfilePhoto/ProfilePhoto"
import Compress from "compress.js"
import { postVerificationEmail, putAccountOnDatabase } from "../../actions/database"

const compress = new Compress()
export default function AccountForm(props) {
  const { token } = useToken()
  const history = useHistory()
  var avatarImageEditor = null
  const setAvatarImageEditorRef = (editor) => (avatarImageEditor = editor)
  const [userData, setUserData] = useState({
    email: props.email,
    name: props.name,
    commercial_name: props.commercial_name,
    phone_number: props.phone_number,
    is_email_verified: props.is_email_verified,
    about_me: props.about_me,
    about_products: props.about_products,
  })
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [password, setPassword] = useState("")
  const [isWaitingResponse, setIsWaitingResponse] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isPropsSet, setIsPropsSet] = useState(false)
  const [operationStatus, setOperationStatus] = useState({
    show: false,
    message: undefined,
    variant: undefined,
  })
  const handleCloseModal = () => setShowModal(false)
  const handleShowModal = () => setShowModal(true)
  const [passwordShown, setPasswordShown] = useState(false)
  const [imagePreview, setImagePreview] = useState(props.original_profile_photo)
  const [image_position, setImagePosition] = useState(props.image_position)
  const [zoom, setZoom] = useState(props.image_zoom || zoomMin)
  const [rotate, setRotate] = useState(props.image_rotate || rotateMin)

  const {
    email,
    name,
    commercial_name,
    phone_number,
    about_me,
    about_products,
    is_email_verified,
  } = userData

  useEffect(() => {
    if (Object.keys(props).length > 0) {
      setIsPropsSet(true)
      setUserData(props)
    }
  }, [props])

  const togglePassword = () => {
    setPasswordShown(!passwordShown)
  }

  async function handleCreateAccount(event) {
    event.preventDefault()

    putAccountOnDatabase({
      email,
      name,
      commercial_name,
      phone_number,
      password,
      setIsWaitingResponse,
      setOperationStatus,
      history,
    })
  }

  async function compressImageAndConvertToBase64(file, params) {
    const compressedImage = await compress.compress([file], params)
    const img = compressedImage[0]
    const base64str = img.data
    return base64str
  }

  const dataURLtoFile = (dataurl, fileName) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], fileName, { type: mime })
  }

  async function handleEditAccount(event) {
    event.preventDefault()

    if (props.email !== email) {
      // we still do not allow change of email as it is
      // the partition key of the admins table
      return
    }

    const body = { email: props.email }

    if (avatarImageEditor !== null) {
      const profilePhotoCropData = avatarImageEditor
        .getImageScaledToCanvas()
        .toDataURL()
      const base64ProfilePhotoCropData = await compressImageAndConvertToBase64(
        dataURLtoFile(profilePhotoCropData),
        { size: 0.4 }
      )

      body.profilePhotoCropData = base64ProfilePhotoCropData

      if (typeof imagePreview === "string") {
        body.originalProfilePhoto = SAME_ORIGINAL_PROFILE_PHOTO_STRING
      } else {
        body.originalProfilePhoto = await compressImageAndConvertToBase64(
          imagePreview,
          { size: 0.4 }
        )
      }
    }

    if (props.name !== name) body.name = name
    if (props.commercial_name !== commercial_name)
      body.commercial_name = commercial_name
    if (props.phone_number !== phone_number) body.phone_number = phone_number
    if (props.about_me !== about_me) body.about_me = about_me
    if (props.about_products !== about_products) body.about_products = about_products
    if (props.image_zoom !== zoom) body.image_zoom = zoom
    if (props.image_rotate !== rotate) body.image_rotate = rotate
    if (
      props.image_position.x !== image_position.x ||
      props.image_position.y !== image_position.y
    ) {
      body.image_position = JSON.stringify(image_position)
    }

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
      setIsWaitingResponse(true)
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
      setIsWaitingResponse(false)
    }
  }

  async function handleEditPasswordAccount(event) {
    event.preventDefault()

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

    if (avatarImageEditor !== null) {
      const profilePhotoCropData = avatarImageEditor.getImage().toDataURL()
      const base64ProfilePhotoCropData = await compressImageAndConvertToBase64(
        dataURLtoFile(profilePhotoCropData),
        { size: 0.4 }
      )

      body.profilePhotoCropData = base64ProfilePhotoCropData

      if (typeof imagePreview === "string") {
        body.originalProfilePhoto = SAME_ORIGINAL_PROFILE_PHOTO_STRING
      } else {
        body.originalProfilePhoto = await compressImageAndConvertToBase64(
          imagePreview,
          { size: 0.4 }
        )
      }
    }

    if (props.name !== name) body.name = name
    if (props.commercial_name !== commercial_name)
      body.commercial_name = commercial_name
    if (props.phone_number !== phone_number) body.phone_number = phone_number

    const config = {
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

      setOperationStatus({
        variant: "success",
        message: response?.data?.message,
        show: true,
      })

      setOldPassword("")
      setNewPassword("")
    } catch (error) {
      setOperationStatus({
        variant: "danger",
        message: error?.response?.data?.message,
        show: true,
      })
    } finally {
      setIsWaitingResponse(false)
    }
  }

  async function sendVerificationEmail() {
    postVerificationEmail({
      token,
      setIsWaitingResponse,
      setOperationStatus,
      email,
      name,
    })
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
                type={passwordShown ? "text" : "password"}
                placeholder=""
              />
              <Form.Check
                className="my-2"
                type="checkbox"
                label="Mostrar senha"
                onChange={togglePassword}
              />
              <PasswordRequirements password={newPassword} />
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
            {...operationStatus}
            setShow={(value) =>
              setOperationStatus({ ...operationStatus, show: value })
            }
          />
          <Form.Group className="mb-3" controlId="formCreateAccountEmail">
            <Form.Label>Email</Form.Label>
            {isPropsSet &&
              (is_email_verified ? (
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
              value={commercial_name}
              onChange={(e) =>
                setUserData({ ...userData, commercial_name: e.target.value })
              }
              type="text"
              placeholder="Ateliê do Gabriel"
            />
          </Form.Group>
          <PhoneNumberInput
            phone_number={phone_number}
            userData={userData}
            setUserData={setUserData}
          />
          {isPropsSet ? (
            <>
              <Form.Group className="mb-3" controlId="formEditAccountAboutMe">
                <Form.Label>Sobre mim</Form.Label>
                <Form.Control
                  value={about_me}
                  onChange={(e) =>
                    setUserData({ ...userData, about_me: e.target.value })
                  }
                  as="textarea"
                  rows={5}
                  placeholder="Esse é um espaço para você contar sobre a sua vida pessoal, profissão, família, curiosidades, hobbies, onde mora, cidade natal, etc. Fique a vontade para adicionar o que você quiser!"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formEditAccountAboutProducts">
                <Form.Label>Sobre os meus produtos</Form.Label>
                <Form.Control
                  value={about_products}
                  onChange={(e) =>
                    setUserData({ ...userData, about_products: e.target.value })
                  }
                  as="textarea"
                  rows={7}
                  placeholder="Esse é um espaço para você contar contar mais sobre os produtos que você faz, há quanto tempo você produz esse tipo de produto, como você começou, quais são os materiais que você mais gosta de utilizar, etc. Fique a vontade para adicionar o que você quiser!"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formEditAccountPassword">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  disabled={true}
                  value={"12345678"}
                  type="password"
                  placeholder=""
                />
                <Button
                  variant="primary"
                  className="w-100 my-2"
                  onClick={handleShowModal}
                >
                  Alterar senha
                </Button>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formEditAccountProfilePhoto">
                <ProfilePhoto
                  position={image_position}
                  setPosition={setImagePosition}
                  zoom={zoom}
                  setZoom={setZoom}
                  rotate={rotate}
                  setRotate={setRotate}
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                  setAvatarImageEditorRef={setAvatarImageEditorRef}
                />
              </Form.Group>
            </>
          ) : (
            <Form.Group className="mb-3" controlId="formCreateAccountPassword">
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
              <PasswordRequirements password={password} />
            </Form.Group>
          )}
          <Button
            type="submit"
            variant="success"
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
