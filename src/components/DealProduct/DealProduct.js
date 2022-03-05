import React from "react"
import { Form, Card } from "react-bootstrap"
import CurrencyInput from "react-currency-input-field"

export default function DealProduct({ price, setPrice }) {
  return (
    <Card>
      <Card.Body>
        <Form.Group className="preview" controlId="formDealPrice">
          <Form.Label>Preço promocional</Form.Label>
          <CurrencyInput
            className="form-control"
            placeholder=""
            decimalsLimit={2}
            onValueChange={(value) => setPrice(value)}
            allowNegativeValue={false}
            prefix="R$ "
            disableGroupSeparators
            value={price}
          />
        </Form.Group>
      </Card.Body>
    </Card>
  )
}
