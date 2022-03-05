import React from "react"
import { Form, ButtonGroup, Button, Card } from "react-bootstrap"
import CurrencyInput from "react-currency-input-field"

import DateTimePicker from "../DateTimePicker/DateTimePicker"

export const lightningDealDurations = {
  "12h": { name: "12h", showName: "12 horas" },
  "24h": { name: "24h", showName: "24 horas" },
  "72h": { name: "72h", showName: "72 horas" },
}

export default function LightningDealProduct({
  selectedDuration,
  setSelectedDuration,
  selectedTime,
  setSelectedTime,
  selectedDate,
  setSelectedDate,
  price,
  setPrice,
}) {
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
        <Form.Group>
          <DateTimePicker
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          <Form.Label>Duração</Form.Label>
          <ButtonGroup className="w-100" vertical aria-label="First group">
            {Object.entries(lightningDealDurations).map((duration, i) => (
              <Button
                active={duration[1].name === selectedDuration}
                onClick={() => setSelectedDuration(duration[1].name)}
                key={i}
                className="my-1"
                variant="outline-secondary"
                style={{ zIndex: 0 }}
              >
                {duration[1].showName}
              </Button>
            ))}
          </ButtonGroup>
        </Form.Group>
      </Card.Body>
    </Card>
  )
}
