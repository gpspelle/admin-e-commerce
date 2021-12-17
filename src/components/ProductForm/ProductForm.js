import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import axios from 'axios';
import ImageUploadPreview from "../ImageUploadPreview/ImageUploadPreview";
import CreateAlert from "../Alert/CreateAlert";
import EditAlert from "../Alert/EditAlert";
import { API, PRODUCT_ENDPOINT, TAGS_ENDPOINT } from "../../constants/constants";
import { Form, Container, Button } from "react-bootstrap";
import TagSelector from "../TagSelector/TagSelector";
import { areArraysEqual } from "../../utils/compareTwoArrays";
import MissingFieldsAlert from "../Alert/MissingFieldsAlert";

export default function ProductForm() {
  const history = useHistory();
  const location = useLocation();
  const imageInput = useRef();
  const [createdTags, setCreatedTags] = useState([]);
  const [edit, setEdit] = useState();
  const [id, setId] = useState();
  const [name, setName] = useState("");
  const [createdProductName, setCreatedProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState(new Set([]));
  const [images, setImages] = useState(null);
  const [imageNames, setImageNames] = useState([]);
  const [imagePreview, setImagePreview] = useState();
  const [createStatus, setCreateStatus] = useState();
  const [editStatus, setEditStatus] = useState();
  const [missingFieldsAlert, setMissingFielsdAlert] = useState(false);

  useEffect(() => {
    async function getTagsFromDatabase() {
      const data = await fetch(`${API}/${TAGS_ENDPOINT}`);
      const json = await data.json();

      setCreatedTags(json);
    }

    getTagsFromDatabase();
  }, [createStatus, editStatus]);

  useEffect(() => {
    if (location.state) {
      setEdit(true);
      setId(location.state.id);
      setName(location.state.name);
      setDescription(location.state.description);
      setPrice(location.state.price);
      setTags(new Set(location.state.tags));
      setImagePreview(location.state.images);
    }
  }, [location]);

  const isCreateInputValid = () => {
    return name !== "" &&
      description !== "" &&
      price !== "" &&
      images &&
      images.length > 0
  }

  async function handleCreateSubmit(event) {
    event.preventDefault();
    setMissingFielsdAlert(false);

    if (!isCreateInputValid()) {
      setMissingFielsdAlert(true);
      return; 
    }

    const transformedImages = [];
    
    for (let i = 0; i < images.length; i+=1) {
      transformedImages.push({ name: imageNames[i], content: images[i]})
    }

    const body = JSON.stringify({
        name,
        description,
        price,
        tags: [...tags],
        images: transformedImages,
    });

    var config = {
        headers: { 'Content-Type': 'application/json' },
      };

    try {
        const res = await axios.put(`${API}/${PRODUCT_ENDPOINT}`, body, config);
        setCreateStatus(res.status);

        if (res.status === 200) {
          imageInput.current.value = null;
          setCreatedProductName(name);
          setName("");
          setDescription("");
          setPrice("");
          setTags(new Set([]));
          setImagePreview();
        }
    } catch (error) {
        console.error(error);
    }
}

  async function handleEditSubmit(event) {
    event.preventDefault();
    setMissingFielsdAlert(false);

    const body = {
      id,
    };

    if (location.state.name !== name) body.PRODUCT_NAME = name; 
    if (location.state.description !== description) body.PRODUCT_DESCRIPTION = description;
    if (location.state.price !== price) body.PRODUCT_PRICE = price;
    if (!areArraysEqual(location.state.tags, [...tags])) body.PRODUCT_TAGS = [...tags];

    if (images) {
      const transformedImages = [];

      for (let i = 0; i < images.length; i+=1) {
        transformedImages.push({ name: imageNames[i], content: images[i]})
      }

      body.PRODUCT_IMAGES = transformedImages;
    }

    var config = {
      headers: { 'Content-Type': 'application/json' },
    };

    try {
      const res = await axios.patch(`${API}/${PRODUCT_ENDPOINT}`, JSON.stringify(body), config);
      setEditStatus(res.status);

      if (res.status === 200) {
        history.push('/gerenciar-produtos')
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  console.log(missingFieldsAlert);
  
  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
        <Form onSubmit={edit ? handleEditSubmit : handleCreateSubmit}>
          <h1>{edit ? 'Edite o produto' : 'Crie um novo produto'}</h1>
          {missingFieldsAlert && <MissingFieldsAlert name={name} description={description} price={price} images={images} />}
          {edit ? <EditAlert status={editStatus} editedProductName={location.state.name} newEditedProductName={name} /> : <CreateAlert status={createStatus} createdProductName={createdProductName} />}
          <Form.Group className="mb-3" controlId="formBasicProductName">
            <Form.Label>Nome</Form.Label>
            <Form.Control value={name} onChange={e => setName(e.target.value)} type="text" placeholder="" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicDescription">
            <Form.Label >Descrição</Form.Label>
            <Form.Control value={description} onChange={e => setDescription(e.target.value)} type="text" placeholder="" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPrice">
            <Form.Label>Preço</Form.Label>
            <Form.Control value={price} onChange={e => setPrice(e.target.value)} type="number" placeholder="" />
          </Form.Group>
          <TagSelector createdTags={createdTags} tags={tags} setTags={setTags} />
          <ImageUploadPreview imageInput={imageInput} imagePreview={imagePreview} setImagePreview={setImagePreview} setImages={setImages} setImageNames={setImageNames} />
          <Button type="submit" className="btn btn-primary">Enviar</Button>
        </Form>
    </Container>
  )
}