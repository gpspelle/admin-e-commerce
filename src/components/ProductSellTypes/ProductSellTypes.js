import React from "react"
import { Form } from "react-bootstrap"
import {
  PRODUCT_ORDER_SELL_TYPE,
  PRODUCT_STOCK_SELL_TYPE,
} from "../../constants/constants"

export const setSellTypeStatesUsingSellTypesArray = ({
  sellTypes,
  setIsProductOrder,
  setIsProductStock,
}) => {
  sellTypes.forEach((sellType) => {
    if (sellType.S === PRODUCT_ORDER_SELL_TYPE) {
      setIsProductOrder(true)
    } else if (sellType.S === PRODUCT_STOCK_SELL_TYPE) {
      setIsProductStock(true)
    }
  })
}

export default function ProductSellTypes({
  isProductStock,
  setIsProductStock,
  isProductOrder,
  setIsProductOrder,
  productStock,
  setProductStock,
}) {
  return (
    <Form.Group className="mb-3" controlId="formBasicStock">
      <Form.Label>Tipo da venda</Form.Label>
      <div style={{ display: "flex" }}>
        <Form.Check
          checked={isProductStock}
          className="my-2"
          type="checkbox"
          label="Em estoque"
          onChange={() => setIsProductStock(!isProductStock)}
          style={{ width: "75%" }}
        />
        {isProductStock && (
          <Form.Control
            value={productStock}
            onChange={(e) => setProductStock(e.target.value)}
            type="number"
            placeholder="1"
            style={{ width: "25%" }}
          />
        )}
      </div>
      <Form.Check
        checked={isProductOrder}
        className="my-2"
        type="checkbox"
        label="Sob encomenda"
        onChange={() => setIsProductOrder(!isProductOrder)}
      />
    </Form.Group>
  )
}
