import React, { useState, useEffect } from 'react';
import Compress from 'compress.js';
import { Card, Form, Row, Container, Col } from 'react-bootstrap';
import  { IoArrowDownCircleSharp, IoArrowUpCircleSharp } from "react-icons/io5"
import "./ImageUploadPreview.css"
import { array_move } from '../../utils/arrayMove';

const compress = new Compress();

export default function ImageUploadPreview({ 
    imageInput,
    imagePreview,
    setImagePreview,
    images,
    setImages,
    imageNames,
    setImageNames,
    orderIndex,
    setOrderIndex,
}) {

    useEffect(() => {
        if (orderIndex.length === 0 && imagePreview && imagePreview.length) {
            setOrderIndex([...Array(imagePreview.length).keys()])
        }
    }, [imagePreview, orderIndex])

    async function resizeImageFnAndConvertToBase64(file) {
        const resizedImage = await compress.compress([file], {
            quality: 0.5, // the quality of the image, max is 1,
        })
        const img = resizedImage[0];
        const base64str = img.data
        return base64str;
    }

    const handleFileUpload = async (e) => {
        const filesAsArray = [...e.target.files];
        setImagePreview(filesAsArray);
        const imageNames = [];
        const order = [];
        const promises = [];

        filesAsArray.forEach((file, i) => {
            const base64FilePromise = resizeImageFnAndConvertToBase64(file);
            promises.push(base64FilePromise);
            order.push(i);
            imageNames.push(file.name);
        })

        const result = await Promise.all(promises);
        setImages(result);
        setImageNames(imageNames);
        setOrderIndex(order);
    };

    const moveUpImage = (i) => {
        const moveUp = (i, array, setFunc) => {
            const copy = [...array];
            array_move(copy, i, i-1);
            setFunc(copy);
        }

        moveUp(i, imagePreview, setImagePreview);
        moveUp(i, orderIndex, setOrderIndex);
        if (images) moveUp(i, images, setImages);
        if (imageNames.length > 0) moveUp(i, imageNames, setImageNames);
    }

    const moveDownImage = (i) => {
        const moveDown = (i, array, setFunc) => {
            const copy = [...array];
            array_move(copy, i, i+1);
            setFunc(copy);
        }

        moveDown(i, imagePreview, setImagePreview);
        moveDown(i, orderIndex, setOrderIndex);
        if (images) moveDown(i, images, setImages);
        if (imageNames.length > 0) moveDown(i, imageNames, setImageNames);
    }

    return (
        <Form.Group className="mb-3 preview" controlId="formBasicImages">
            <Form.Control ref={imageInput} type="file" multiple={true} className="form-control" accept=".jpg, .jpeg, .png" onChange={(e) => handleFileUpload(e)} />
            {imagePreview && imagePreview.length > 1 && <div style={{ marginTop: "10px" }}>Use as setinhas para ordenar as imagens</div>}
            <Container>
                <Row>
                    {imagePreview && imagePreview.map((image, i) => {
                        return (
                            <Col
                                key={i}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: "12px",
                                }}
                            >
                                <Card style={{ width: "18rem", border: "none" }} className="my-2">
                                    <img className={i === 0 ? "golden-frame" : ""} key={image.name ? image.name : image} width={286} height={256} src={image.name ? URL.createObjectURL(image) : image} alt={`${i}`} />
                                    <div style={{ display: "flex", justifyContent: "center", marginTop: "8px", height: "44px" }}>
                                        {i !== 0 && <IoArrowUpCircleSharp className="arrow-button" style={{ left: "8px" }} onClick={() => moveUpImage(i)} />}
                                        <Card.Text style={{ textAlign: "center", marginTop: "0.75rem" }}>{i === 0 ? "Foto de capa" : `Foto ${i}`}</Card.Text>
                                        {i < imagePreview.length -1 && <IoArrowDownCircleSharp className="arrow-button" style={{ right: "8px" }} onClick={() => moveDownImage(i)} />}
                                    </div>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            </Container>
        </Form.Group>
    );
}