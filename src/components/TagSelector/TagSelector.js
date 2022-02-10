import React, { useState } from "react"
import { Form, Col, Button } from "react-bootstrap"

import Tag from "../Tag/Tag"
import TagDropdown from "../TagDropdown/TagDropdown"

export default function TagSelector({ createdTags, tags, setTags }) {
  const [showTagMenu, setShowTagMenu] = useState(false)

  const addTag = (tag, setValue) => {
    const deepCopySet = new Set([...tags])
    deepCopySet.add(tag)
    setTags(deepCopySet)
    setValue("")
  }

  const onDeleteTag = (tag) => {
    const deepCopySet = new Set([...tags])
    deepCopySet.delete(tag)
    setTags(deepCopySet)
  }

  return (
    <Form.Group className="mb-3 preview" controlId="formBasicTags">
      <Form.Label>Tags</Form.Label>
      <Button
        style={{ width: "100%" }}
        active={showTagMenu}
        variant="outline-secondary"
        onClick={() => setShowTagMenu(!showTagMenu)}
      >
        Adicionar Tags
      </Button>
      <TagDropdown
        showTagMenu={showTagMenu}
        createdTags={createdTags}
        selectedTags={[...tags]}
        onClick={addTag}
      />
      {[...tags].map((tag, i) => (
        <Col
          style={{
            display: "flex",
            alignItems: "center",
            paddingTop: "8px",
          }}
          key={i}
        >
          <Tag tag={tag} onDelete={onDeleteTag} />
        </Col>
      ))}
    </Form.Group>
  )
}
