import React, { useState } from "react";
import { Alert } from "react-bootstrap";

export default function EditAlert({ status, editedProductName, newEditedProductName}) {
    const [show, setShow] = useState(true);

    const statusToAlert = {
        400: { variant: 'danger', Heading: `O produto anteriormente chamado de ${editedProductName}, com novo nome de ${newEditedProductName} não foi alterado corretamente, tente novamente.`},
        500: { variant: 'danger', Heading: `O produto anteriormente chamado de ${editedProductName}, com novo nome de ${newEditedProductName} não foi alterado corretamente, tente novamente.`}
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