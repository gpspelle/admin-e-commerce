import React from "react"
import { ButtonGroup, Button, Form } from "react-bootstrap"

import DealProduct from "../DealProduct/DealProduct"
import LightingDealProduct from "../LightingDealProduct/LightingDealProduct"

export const productTypes = {
  NORMAL: { name: "NORMAL", showName: "Normal" },
  DEAL: { name: "DEAL", showName: "Oferta" },
  LIGHTING_DEAL: { name: "LIGHTING_DEAL", showName: "Oferta Relâmpago" },
}

export default function ProductType({
  productType,
  setProductType,
  lightingDealDuration,
  setLightingDealDuration,
  lightingDealTime,
  setLightingDealTime,
  lightingDealDate,
  setLightingDealDate,
  dealPrice,
  setDealPrice,
}) {
  return (
    <Form.Group className="mb-3" controlId="formBasicPrice">
      <Form.Label>Tipo do produto</Form.Label>
      <ButtonGroup className="w-100" vertical aria-label="First group">
        {Object.entries(productTypes).map((pt, i) => (
          <Button
            active={pt[1].name === productType}
            onClick={() => setProductType(pt[1].name)}
            key={i}
            className="my-2"
            variant="outline-secondary"
          >
            {pt[1].showName}
          </Button>
        ))}
      </ButtonGroup>
      {productType === productTypes.DEAL.name && (
        <DealProduct price={dealPrice} setPrice={setDealPrice} />
      )}
      {productType === productTypes.LIGHTING_DEAL.name && (
        <LightingDealProduct
          price={dealPrice}
          setPrice={setDealPrice}
          selectedDuration={lightingDealDuration}
          setSelectedDuration={setLightingDealDuration}
          selectedTime={lightingDealTime}
          setSelectedTime={setLightingDealTime}
          selectedDate={lightingDealDate}
          setSelectedDate={setLightingDealDate}
        />
      )}
    </Form.Group>
  )
}
