import React from "react"
import { Button } from "react-bootstrap"
import { AiOutlineClose } from "react-icons/ai"

export default function Tag({ tag, onDelete }) {
  return (
    <Button variant="outline-secondary" style={{ display: "flex" }}>
      <div>{tag}&nbsp;</div>
      <AiOutlineClose
        style={{ fontSize: "24px" }}
        onClick={(e) => onDelete(tag)}
        aria-label="hide"
      />
    </Button>
  )
}
