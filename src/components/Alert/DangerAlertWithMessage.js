import React from "react";
import { Alert } from "react-bootstrap";

export default function DangerAlertWithMessage({ show, setShow, message }) {
    if (show) {
        return (
            <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>{message}</Alert.Heading>
            </Alert>
        )
    }

    return null;
}