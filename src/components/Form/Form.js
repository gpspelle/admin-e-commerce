import React, { useState } from "react";
import ImageUploadPreview from "../ImageUploadPreview/ImageUploadPreview";

export default function Form() {
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [price, setPrice] = useState();
    const [images, setImages] = useState();

    function handleSubmit() {
        console.log(name, description, price, images);
    }

    return (
        <div>
            <h1>Crie um novo produto</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" id="inputName" aria-describedby="nameHelp" onChange={e => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <textarea className="form-control" aria-label="With textarea" onChange={e => setDescription(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input type="number" className="form-control" id="inputPrice" aria-describedby="priceHelp" onChange={e => setPrice(e.target.value)} />
                </div>
                <ImageUploadPreview />
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
      )
}