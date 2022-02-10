import React from "react"
import RangeSlider from "react-bootstrap-range-slider"
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css"

import { ButtonGroup, Form, ToggleButton } from "react-bootstrap"

import "./ProductStockSlider.css"

export const PRODUCT_STOCK = "0"
export const PRODUCT_ORDER = "1"

export default function ProductStockSlider({
  productStock,
  setProductStock,
  productStockOrOrder,
  setProductStockOrOrder,
}) {
  const radios = [
    { name: "Em estoque", value: PRODUCT_STOCK },
    { name: "Sob encomenda", value: PRODUCT_ORDER },
  ]

  return (
    <Form.Group className="mb-3" controlId="formBasicStock">
      <ButtonGroup className="w-100 my-2">
        {radios.map((radio, idx) => (
          <ToggleButton
            key={idx - 1}
            id={`radio-${idx - 1}`}
            type="radio"
            variant={idx % 2 ? "outline-danger" : "outline-success"}
            name="radio"
            value={radio.value}
            checked={productStockOrOrder === radio.value}
            onChange={(e) => {
              if (e.currentTarget.value === PRODUCT_ORDER) {
                setProductStock("0")
              } else {
                setProductStock("1")
              }
              setProductStockOrOrder(e.currentTarget.value)
            }}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
      {productStockOrOrder === PRODUCT_STOCK && (
        <div style={{ display: "flex" }}>
          <RangeSlider
            value={productStock}
            onChange={(e) => setProductStock(e.target.value)}
            style={{ width: "95%" }}
            min={1}
          />
          <Form.Control
            value={productStock}
            onChange={(e) => setProductStock(e.target.value)}
            type="text"
            placeholder="1"
            style={{
              width: "15%",
            }}
          ></Form.Control>
        </div>
      )}
    </Form.Group>
  )
}
