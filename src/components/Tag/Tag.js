import React from "react";
import { CloseButton, Button } from "react-bootstrap";

export default function Tag({ tag, onDelete }) {
    return (
        <Button variant="outline-secondary" style={{ display: "flex" }}>
            <div>
                {tag}
            </div>
            <CloseButton onClick={(e) => onDelete(tag)} aria-label="hide" />
        </Button>
    )
}