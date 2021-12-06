import React, { useState } from "react";
import { Alert } from "react-bootstrap";

export default function CreateAlert({ status, createdProductName }) {
    const [show, setShow] = useState(true);

    const statusToAlert = {
        200: { variant: 'success', Heading: `O produto ${createdProductName} foi criado com sucesso.`},
        400: { variant: 'danger', Heading: `O produto ${createdProductName} não foi criado corretamente, tente novamente.`}
    }

    if (statusToAlert[status] && show) {
        return (
            <Alert variant={statusToAlert[status].variant} onClose={() => setShow(false)} dismissible>
                <Alert.Heading>{statusToAlert[status].Heading}</Alert.Heading>
            </Alert>
        )
    }

    return null;
}