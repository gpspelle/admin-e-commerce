import React, { useState } from "react";
import { Alert } from "react-bootstrap";

export default function DeleteAlert({ status, deletedProductName }) {
    const [show, setShow] = useState(true);

    const statusToAlert = {
        200: { variant: 'success', Heading: `O produto ${deletedProductName} foi deletado com sucesso.`},
        400: { variant: 'danger', Heading: `O produto ${deletedProductName} não foi deletado corretamente, tente novamente.`},
        500: { variant: 'danger', Heading: `O produto ${deletedProductName} não foi deletado corretamente, tente novamente.`}
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