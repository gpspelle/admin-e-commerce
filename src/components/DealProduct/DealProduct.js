import React from "react"
import { Form, Card } from "react-bootstrap"

export default function DealProduct({ price, setPrice }) {
  return (
    <Card>
      <Card.Body>
        <Form.Group className="preview" controlId="formDealPrice">
          <Form.Label>Preço promocional</Form.Label>
          <Form.Control
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            placeholder=""
          />
        </Form.Group>
      </Card.Body>
    </Card>
  )
}
