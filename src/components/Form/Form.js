import React, { useState, useRef } from "react";
import axios from 'axios';
import ImageUploadPreview from "../ImageUploadPreview/ImageUploadPreview";
import CreateAlert from "../Alert/CreateAlert";

const api = 'https://qbhf2c9996.execute-api.us-east-1.amazonaws.com/dev';

export default function Form() {
    const textInputName = useRef();
    const textInputDescription = useRef();
    const textInputPrice = useRef();
    const imageInput = useRef();
    const [name, setName] = useState("");
    const [createdProductName, setCreatedProductName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("0");
    const [images, setImages] = useState(null);
    const [imageNames, setImageNames] = useState([]);
    const [imagePreview, setImagePreview] = useState();
    const [createStatus, setCreateStatus] = useState();

    async function handleSubmit(event) {
        event.preventDefault();

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
              setPrice("0");
              setImagePreview();
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <h1>Crie um novo produto</h1>
            <CreateAlert status={createStatus} createdProductName={createdProductName} />
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input ref={textInputName} type="text" className="form-control" id="inputName" aria-describedby="nameHelp" onChange={e => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea ref={textInputDescription} value={description} className="form-control" aria-label="With textarea" onChange={e => setDescription(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input ref={textInputPrice} value={price} type="number" className="form-control" id="inputPrice" aria-describedby="priceHelp" onChange={e => setPrice(e.target.value)} />
                </div>
                <ImageUploadPreview imageInput={imageInput} imagePreview={imagePreview} setImagePreview={setImagePreview} setImages={setImages} setImageNames={setImageNames} />
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
      )
}