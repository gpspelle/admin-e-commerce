import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { Button, Card, Modal, Spinner } from "react-bootstrap"
import axios from "axios"
import { ACCESS_TOKEN_NAME, API, PRODUCT_ENDPOINT } from "../../constants/constants"
import useToken from "../../hooks/useToken"
import { productTypes } from "../ProductType/ProductType"
import LightingDealWaterMark from "../LightingDealWaterMark/LightingDealWaterMark"
import LightingDealDuration from "../LightingDealDuration/LightingDealDuration"
import { getIsDeal } from "../../utils/DealUtils"
import { getIsLightingDeal } from "../../utils/LightingDealUtils"

export default function Product({ 
  setShowDeleteAlert,
  fetchData,
  setFetchData,
  setDeleteStatus,
  setDeletedProductName,
  id,
  name,
  description,
  price,
  tags,
  images,
  productType,
  lightingDealStartTime,
  lightingDealDuration,
  dealPrice,
}) {
  const { token } = useToken()
  const history = useHistory()
  const [showModal, setShowModal] = useState(false);
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const isDeal = getIsDeal(productType)
  const isLightingDeal = getIsLightingDeal(productType)

  const deleteProduct = async () => {
    setShowDeleteAlert(false);
    handleCloseModal();
    const body = {
      id,
    };
  
    const headers = { 
      "Content-Type": "text/plain",
      [ACCESS_TOKEN_NAME]: token
    };

    try {
      setDeletedProductName(name);
      setIsWaitingResponse(true);
      const res = await axios.delete(`${API}/${PRODUCT_ENDPOINT}`, { data: body, headers });
      setDeleteStatus(res.status);
      setFetchData(fetchData + 1);
    } catch (error) {
      setDeleteStatus(error.statusCode);
    } finally {
      setIsWaitingResponse(false);
      setShowDeleteAlert(true);
    }
  }

  const editProduct = async () => {
    const state = { 
      id, 
      name, 
      description, 
      price, 
      tags, 
      images,
      productType,
    };

    if (productType === productTypes.DEAL.name) {
      state.dealPrice = dealPrice;
    } else if (productType === productTypes.LIGHTING_DEAL.name) {
      const date = new Date(lightingDealStartTime);
      const minutes = date.getMinutes();
      const lightingDealTime = `${date.getHours()}:${minutes < 10 ? '0' : ''}${minutes}`;
      state.lightingDealDate = date;
      state.lightingDealTime = lightingDealTime;
      state.lightingDealDuration = lightingDealDuration;
      state.dealPrice = dealPrice;
      state.lightingDealStartTime = lightingDealStartTime;
    }

    history.push({
      pathname: `/${id}/edit`,
      state
    })
  }

  return (
    <div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Deletar produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>{`Deseja mesmo deletar o produto ${name}?`}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Não
          </Button>
          <Button variant="primary" onClick={() => deleteProduct()}>
            Sim
          </Button>
        </Modal.Footer>
      </Modal>
      <Card style={{ width: "18rem", cursor: "pointer" }} onClick={editProduct}>
      <img
        width="286px"
        height="256px"
        src={images[0]}
        alt={`286x256`}
      />
      {isLightingDeal && <LightingDealWaterMark />}
      <Card.Body>
        <Card.Title className="notranslate">{name}</Card.Title>
        <Button 
          disabled={isWaitingResponse} 
          variant="danger" 
          style={{ width: "100%", marginBottom: "4%" }}
          onClick={handleShowModal}
        >
          {isWaitingResponse &&
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
          }
          {isWaitingResponse ? " Aguarde..." : "Deletar"}
        </Button>
        <Card.Text style={{ display: "flex", justifyContent: "center" }}>
          <div
            className="notranslate"
            style={{
              textAlign: "center",
              textDecoration: isDeal ? "line-through" : "none",
              color: isDeal ? "lightgray" : "inherit",
            }}
          >
            R$ {price}
          </div>
          {isDeal && (
            <div
              className="notranslate"
              style={{
                textAlign: "center",
                paddingLeft: "6px",
              }}
            >
              R$ {dealPrice}
            </div>
          )}
        </Card.Text>
        <LightingDealDuration
          lightingDealDuration={lightingDealDuration}
          lightingDealStartTime={lightingDealStartTime}
        />
      </Card.Body>
    </Card>
    </div>
    
  )
}
