import React, { useState } from "react";
import { Alert } from "react-bootstrap";

const getMissingRequiredFields = (name, description, price, images) => {
    let missingRequiredFields = '';

    if (name === "") {
        missingRequiredFields += "nome, ";
    }

    if (description === "") {
        missingRequiredFields += "descrição, ";
    }

    if (price === "") {
        missingRequiredFields += "preço, ";
    }

    if (!images || images.length === 0) {
        missingRequiredFields += "ao menos uma imagem, ";
    }

    return missingRequiredFields.substring(0, missingRequiredFields.length - 2);
}

export default function MissingFieldsAlert({ name, description, price, images }) {
    const [show, setShow] = useState(true);
    const missingRequiredFields = getMissingRequiredFields(name, description, price, images);

    if (show) {
        return (
            <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>Os seguintes campos são obrigatórios: {missingRequiredFields}</Alert.Heading>
            </Alert>
        )
    }

    return null;
}