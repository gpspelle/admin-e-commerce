import React, { useState } from "react";
import { Form, Button, FormControl, InputGroup, Col } from "react-bootstrap";
import Tag from "../Tag/Tag";

export default function TagSelector({ tags, setTags }) {
    const [actualTag, setActualTag] = useState("");

    const addTag = () => {
        const newTag = [...tags];
        newTag.push(actualTag);
        setActualTag("")
        return newTag;
    }

    const onDeleteTag = (tag) => {
        const index = tags.indexOf(tag);
        if (index !== -1) {
            const newTags = [...tags];
            newTags.splice(index, 1);
            setTags(newTags);
        }
    }

    return (
        <Form.Group className="mb-3 preview" controlId="formBasicTags">
            <Form.Label>Tags</Form.Label>
            <InputGroup>
                <FormControl
                    aria-label="Example text with button addon"
                    aria-describedby="basic-tag"
                    value={actualTag}
                    onChange={e => setActualTag(e.target.value)} type="text" placeholder=""
                />
                <Button onClick={() => setTags(addTag)} variant="outline-secondary" id="button-add-tag">
                    Adicionar tag
                </Button>
            </InputGroup>
            {tags.map((tag, i) =>
                <Col
                    style={{
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "center",
                        padding: "4px",
                    }}
                    key={i}
                >
                    <Tag tag={tag} onDelete={onDeleteTag}/>
                </Col>
            )}
        </Form.Group>      
    )
}