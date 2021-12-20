import React, { useState, useRef } from "react";
import { Dropdown, FormControl } from "react-bootstrap";
import "./TagDropdown.css";

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const TagMenu = React.forwardRef(
    ({ value, setValue, onClick, createdTagsItems, createdTags, selectedTags, style, className, 'aria-labelledby': labeledBy }, ref) => {
        const isValueInSelectedTags = selectedTags.includes(value);
        const isValueInCreatedTags = createdTags.includes(value);
        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                <FormControl
                    autoFocus
                    className="my-2 w-100"
                    placeholder="Crie ou escolha tags..."
                    onChange={(e) => setValue(e.target.value.replace(/\s/g, '').toLowerCase())}
                    value={value}
                />
                <ul 
                    style={{
                            paddingLeft: "0px",
                            maxHeight: "100px",
                            overflow: "hidden",   // then set overflow to hidden in all respects
                            overflowY: "scroll", // At the end only from the top and bottom overflow to scrollable
                    }}
                >
                    {value.length > 0 && !isValueInSelectedTags && !isValueInCreatedTags && <Dropdown.Item active={!isValueInSelectedTags} style={{ paddingLeft: "12px" }} onClick={() => onClick(value, setValue)} key={"createTag"} eventKey={"createTag"}>Criar tag <strong>{value}</strong></Dropdown.Item>}
                    {
                        createdTagsItems && createdTagsItems.filter(
                            (child) => {
                                if (selectedTags.includes(child.props.children.toLowerCase())) {
                                    return false;
                                }
            
                                return !value || child.props.children.toLowerCase().startsWith(value);

                            }
                        )
                    }
                </ul>
            </div>
        );
    },
);

export default function TagDropdown({ showTagMenu, selectedTags, createdTags, onClick }) {
    const menuRef = useRef();
    const [value, setValue] = useState("");
    const createdTagsNames = createdTags.map((tag) => tag.TAG_NAME).sort()
    const createdTagsItems = createdTagsNames.map((tag, i) =>
        <Dropdown.Item active={tag === value} style={{ paddingLeft: "12px" }} onClick={(e) => onClick(e.target.text, setValue)} key={i} eventKey={i}>{tag}</Dropdown.Item>
    )

    return (
        <Dropdown>
            {showTagMenu && 
                <TagMenu 
                    ref={menuRef}
                    onClick={onClick}
                    value={value}
                    setValue={setValue}
                    createdTagsItems={createdTagsItems} 
                    createdTags={createdTagsNames} 
                    selectedTags={selectedTags}
                />
            } 
        </Dropdown>
   ) 
}