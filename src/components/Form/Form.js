import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import axios from 'axios';
import ImageUploadPreview from "../ImageUploadPreview/ImageUploadPreview";
import CreateAlert from "../Alert/CreateAlert";
import EditAlert from "../Alert/EditAlert";

const api = 'https://qbhf2c9996.execute-api.us-east-1.amazonaws.com/dev';

export default function Form() {
  const history = useHistory();
  const location = useLocation();
  const textInputName = useRef();
  const textInputDescription = useRef();
  const textInputPrice = useRef();
  const imageInput = useRef();
  const [edit, setEdit] = useState();
  const [id, setId] = useState();
  const [name, setName] = useState("");
  const [createdProductName, setCreatedProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState(null);
  const [imageNames, setImageNames] = useState([]);
  const [imagePreview, setImagePreview] = useState();
  const [createStatus, setCreateStatus] = useState();
  const [editStatus, setEditStatus] = useState();

  useEffect(() => {
    if (location.state) {
      setEdit(true);
      setId(location.state.id);
      setName(location.state.name);
      setDescription(location.state.description);
      setPrice(location.state.price);
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

    if (!isCreateInputValid()) return;

    const transformedImages = [];
    
    for (let i = 0; i < images.length; i+=1) {
      transformedImages.push({ name: imageNames[i], content: images[i]})
    }

    const body = JSON.stringify({
        name,
        description,
        price,
        images: transformedImages,
    });

    var config = {
        headers: { 'Content-Type': 'application/json' },
      };

    try {
        const res = await axios.put(`${api}/product`, body, config);
        setCreateStatus(res.status);

        if (res.status === 200) {
          textInputName.current.value = "";
          textInputDescription.current.value = "";
          textInputPrice.current.value = "0";
          imageInput.current.value = null;

          setCreatedProductName(name);
          setName("");
          setDescription("");
          setPrice("");
          setImagePreview();
        }
    } catch (error) {
        console.error(error);
    }
}

  async function handleEditSubmit(event) {
    event.preventDefault();

    const body = {
      id,
    };

    if (location.state.name !== name) body.PRODUCT_NAME = name; 
    if (location.state.description !== description) body.PRODUCT_DESCRIPTION = description;
    if (location.state.price !== price) body.PRODUCT_PRICE = price;

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
      const res = await axios.patch(`${api}/product`, JSON.stringify(body), config);
      setEditStatus(res.status);

      if (res.status === 200) {
        history.push('/gerenciar-produtos')
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
        <h1>{edit ? 'Edite o produto' : 'Crie um novo produto'}</h1>
        {edit ? <EditAlert status={editStatus} editedProductName={location.state.name} newEditedProductName={name} /> : <CreateAlert status={createStatus} createdProductName={createdProductName} />}
        <form onSubmit={edit ? handleEditSubmit : handleCreateSubmit}>
          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input ref={textInputName} value={name} type="text" className="form-control" id="inputName" aria-describedby="nameHelp" onChange={e => setName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Descrição</label>
            <textarea ref={textInputDescription} value={description} className="form-control" aria-label="With textarea" onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Preço</label>
            <input ref={textInputPrice} value={price} type="number" className="form-control" id="inputPrice" aria-describedby="priceHelp" onChange={e => setPrice(e.target.value)} />
          </div>
          <ImageUploadPreview imageInput={imageInput} imagePreview={imagePreview} setImagePreview={setImagePreview} setImages={setImages} setImageNames={setImageNames} />
          <button type="submit" className="btn btn-primary">Enviar</button>
        </form>
    </div>
  )
}