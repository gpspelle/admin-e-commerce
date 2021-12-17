import React, { useState } from "react";
import { Form, InputGroup, Col, Button } from "react-bootstrap";
import Tag from "../Tag/Tag";
import TagDropdown from "../TagDropdown/TagDropdown";

export default function TagSelector({ createdTags, tags, setTags }) {
    const [showTagMenu, setShowTagMenu] = useState(false);

    const addTag = (tag, setValue) => {
        const deepCopySet = new Set([...tags]);
        deepCopySet.add(tag);
        setTags(deepCopySet);
        setValue("")
    }

    const onDeleteTag = (tag) => {
        const deepCopySet = new Set([...tags]);
        deepCopySet.delete(tag);
        setTags(deepCopySet);
    }

    return (
        <Form.Group className="mb-3 preview" controlId="formBasicTags">
            <InputGroup>
                <Button style={{width: "100%"}} variant="outline-primary" onClick={() => setShowTagMenu(!showTagMenu)}>Adicionar Tags</Button>
            </InputGroup>
            <TagDropdown showTagMenu={showTagMenu} createdTags={createdTags} selectedTags={[...tags]} onClick={addTag} />
            {[...tags].map((tag, i) =>
                <Col
                    style={{
                        display: "flex",
                        alignItems: "center",
                        paddingTop: "8px"
                    }}
                    key={i}
                >
                    <Tag tag={tag} onDelete={onDeleteTag}/>
                </Col>
            )}
        </Form.Group>      
    )
}