import React from 'react';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input/input';
import { Form } from 'react-bootstrap';

export default function PhoneNumberInput({ phoneNumber, setPhoneNumber }) {
    // `value` will be the parsed phone number in E.164 format.
    // Example: "+12133734253".
    return (
        <Form.Group className="mb-3" controlId="formCreateAccountPhoneNumber">
            <Form.Label>Número de telefone com DDD</Form.Label>
            <PhoneInput
                className="form-control"
                country="BR"
                placeholder=""
                value={phoneNumber}
                onChange={setPhoneNumber}
            />
        </Form.Group>
    )
}