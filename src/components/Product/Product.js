import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { Button, Card, Modal, Spinner } from "react-bootstrap"

import useToken from "../../hooks/useToken"
import { productTypes } from "../ProductType/ProductType"
import { getIsDeal } from "../../utils/dealUtils"
import { getIsLightningDeal } from "../../utils/lightningDealUtils"
import ProgressiveBlurryImageLoad from "../ProgressiveBlurryImageLoad/ProgressiveBlurryImageLoad"
import { deleteProductOnDatabase } from "../../actions/database"
import { EDIT_PRODUCT } from "../../constants/constants"
import LightningDealDuration from "../LightningDeal/LightningDealDuration"
import LightningDealWaterMark from "../LightningDeal/LightningDealWaterMark"

export default function Product({
  setOperationStatus,
  id,
  name,
  description,
  price,
  tags,
  images,
  coverImage,
  productType,
  lightningDealStartTime,
  lightningDealDuration,
  dealPrice,
  productStock,
  productSellTypes,
}) {
  const { token } = useToken()
  const history = useHistory()
  const [showModal, setShowModal] = useState(false)
  const [isWaitingResponse, setIsWaitingResponse] = useState(false)

  const handleCloseModal = () => setShowModal(false)
  const handleShowModal = () => setShowModal(true)

  const isDeal = getIsDeal(productType)
  const isLightningDeal = getIsLightningDeal(productType)

  const handleDeleteProduct = async () => {
    deleteProductOnDatabase({
      token,
      setIsWaitingResponse,
      setOperationStatus,
      handleCloseModal,
      id,
      name,
    })
  }

  const handleEditProduct = async (event) => {
    if (event.target.type === "button") return
    const state = {
      id,
      name,
      description,
      price,
      tags,
      images,
      productType,
      productStock,
      productSellTypes,
    }

    if (productType === productTypes.DEAL.name) {
      state.dealPrice = dealPrice
    } else if (productType === productTypes.LIGHTNING_DEAL.name) {
      const date = new Date(lightningDealStartTime)
      const minutes = date.getMinutes()
      const lightningDealTime = `${date.getHours()}:${
        minutes < 10 ? "0" : ""
      }${minutes}`
      state.lightningDealDate = date
      state.lightningDealTime = lightningDealTime
      state.lightningDealDuration = lightningDealDuration
      state.dealPrice = dealPrice
      state.lightningDealStartTime = lightningDealStartTime
    }

    history.push({
      pathname: `/${id}/${EDIT_PRODUCT}`,
      state,
    })
  }

  var productContainerSize = "260px"
  var productImageSize = "258px"

  return (
    <div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Deletar produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>{`Deseja mesmo deletar o produto ${name}?`}</Modal.Body>
        <Modal.Footer>
          <Button
            className="no-border grey-dark-background"
            onClick={handleCloseModal}
          >
            Não
          </Button>
          <Button
            className="no-border helper-error-background"
            onClick={() => handleDeleteProduct()}
          >
            Sim
          </Button>
        </Modal.Footer>
      </Modal>
      <Card
        style={{ maxWidth: productContainerSize, cursor: "pointer" }}
        onClick={handleEditProduct}
      >
        {coverImage ? (
          <ProgressiveBlurryImageLoad
            width={productImageSize}
            height={productImageSize}
            small={`data:image/jpeg;base64,${coverImage}`}
            large={images[0]}
          />
        ) : (
          <img
            style={{
              width: productImageSize,
              height: productImageSize,
              objectFit: "contain",
              backgroundColor: "#F4F4F4",
            }}
            src={images[0]}
            alt={`286x256`}
          />
        )}
        {isLightningDeal && <LightningDealWaterMark />}
        <Card.Body style={{ width: productContainerSize }}>
          <Card.Title className="notranslate">{name}</Card.Title>
          <Button
            className="helper-error-background"
            disabled={isWaitingResponse}
            variant="danger"
            style={{ width: "100%", marginBottom: "4%" }}
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
            {isWaitingResponse ? " Aguarde..." : "Deletar"}
          </Button>
          <div style={{ justifyContent: "center", display: "flex" }}>
            <Card.Text
              className="notranslate"
              style={{
                textDecoration: isDeal ? "line-through" : "none",
                color: isDeal ? "lightgray" : "inherit",
                marginBottom: isDeal ? "0" : "",
              }}
            >
              R$ {price}
            </Card.Text>
            {isDeal && (
              <Card.Text className="notranslate">&nbsp;R$ {dealPrice}</Card.Text>
            )}
          </div>
          {isLightningDeal && (
            <LightningDealDuration
              lightningDealDuration={lightningDealDuration}
              lightningDealStartTime={lightningDealStartTime}
            />
          )}
        </Card.Body>
      </Card>
    </div>
  )
}
