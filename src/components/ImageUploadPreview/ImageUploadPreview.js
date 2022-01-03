import React, { useEffect } from 'react';
import Compress from 'compress.js';
import { Card, Form, Row, Container, Col } from 'react-bootstrap';
import  { IoArrowDownCircleSharp, IoArrowUpCircleSharp } from "react-icons/io5"
import "./ImageUploadPreview.css"
import { arrayMove } from '../../utils/arrayMove';
import axios from 'axios';

const compress = new Compress();

export default function ImageUploadPreview({ 
    imageInput,
    imagePreview,
    setImagePreview,
    images,
    setImages,
    imagesResized,
    setImagesResized,
    imageNames,
    setImageNames,
    orderIndex,
    setOrderIndex,
}) {

    useEffect(() => {
        if (orderIndex.length === 0 && imagePreview && imagePreview.length) {
            setOrderIndex([...Array(imagePreview.length).keys()])
        }
    }, [imagePreview, orderIndex, setOrderIndex])

    useEffect(() => {
        async function resizeImages() {
            const promises = [];

            if (imagePreview) {
                imagePreview.forEach((image) => {
                    const compressed = compressBase64AndResize(image);
                    promises.push(compressed);
                })
            } 

            const result = await Promise.all(promises);
            setImagesResized(result);
        }
      
        if (!imagesResized) {
            resizeImages();
        }
    }, [imagePreview, setImagesResized, imagesResized])

    async function compressImageAndConvertToBase64(file, params) {
        const compressedImage = await compress.compress([file], params)
        const img = compressedImage[0];
        console.log(img.endSizeInMb, params)
        const base64str = img.data
        return base64str;
    }

    async function compressBase64AndResize(base64URL) {
        async function getBase64(url) {
            return axios
                .get(url, {
                    responseType: 'arraybuffer'
                })
                .then(response => Buffer.from(response.data, 'binary').toString('base64'))
        }
        const compressedAndResizedImage = await compress.compress([Compress.convertBase64ToFile(await getBase64(base64URL))], {
            maxWidth: 64, maxHeight: 64
        })
        const img = compressedAndResizedImage[0];
        const base64str = img.data
        return base64str;
    }

    const handleFileUpload = async (e) => {
        const filesAsArray = [...e.target.files];
        const imageNames = [];
        const order = [];
        const promises = [];
        const promisesResized = [];

        filesAsArray.forEach((file, i) => {
            const base64FilePromise = compressImageAndConvertToBase64(file, { size: 0.8 });
            const base64FileResizedPromise = compressImageAndConvertToBase64(file, { maxWidth: 64, maxHeight: 64 });
            promises.push(base64FilePromise);
            promisesResized.push(base64FileResizedPromise);
            order.push(i);
            imageNames.push(file.name);
        })

        const result = await Promise.all(promises);
        const resultResized = await Promise.all(promisesResized);

        setImages(result);
        setImagePreview(filesAsArray);
        setImagesResized(resultResized);
        setImageNames(imageNames);
        setOrderIndex(order);
    };

    const moveUpImage = (i) => {
        const moveUp = (i, array, setFunc) => {
            const copy = [...array];
            arrayMove(copy, i, i-1);
            setFunc(copy);
        }

        moveUp(i, imagePreview, setImagePreview);
        moveUp(i, orderIndex, setOrderIndex);
        if (images) moveUp(i, images, setImages);
        if (imagesResized) moveUp(i, imagesResized, setImagesResized);
        if (imageNames.length > 0) moveUp(i, imageNames, setImageNames);
    }

    const moveDownImage = (i) => {
        const moveDown = (i, array, setFunc) => {
            const copy = [...array];
            arrayMove(copy, i, i+1);
            setFunc(copy);
        }

        moveDown(i, imagePreview, setImagePreview);
        moveDown(i, orderIndex, setOrderIndex);
        if (images) moveDown(i, images, setImages);
        if (imagesResized) moveDown(i, imagesResized, setImagesResized);
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