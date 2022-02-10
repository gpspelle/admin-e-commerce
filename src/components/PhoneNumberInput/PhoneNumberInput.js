import React from "react"
import { Form } from "react-bootstrap"
import PhoneInput from "react-phone-number-input/input"
import "react-phone-number-input/style.css"

export default function PhoneNumberInput({ phone_number, userData, setUserData }) {
  // `value` will be the parsed phone number in E.164 format.
  // Example: "+12133734253".
  return (
    <Form.Group className="mb-3" controlId="formCreateAccountPhoneNumber">
      <Form.Label>Número de telefone com DDD</Form.Label>
      <PhoneInput
        className="form-control"
        country="BR"
        placeholder=""
        value={phone_number}
        onChange={(value) => setUserData({ ...userData, phone_number: value })}
      />
    </Form.Group>
  )
}
