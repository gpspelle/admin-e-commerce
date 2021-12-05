import React, { useState } from 'react';
 
export default function ImageUploadPreview( { setImages, setImageNames }) {
    const [imagePreview, setImagePreview] = useState();

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = () => {
            resolve(fileReader.result);
          };
          fileReader.onerror = (error) => {
            reject(error);
          };
        });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        setImagePreview(URL.createObjectURL(e.target.files[0]));
        const base64 = await convertToBase64(file);
        setImages(base64);
        setImageNames(e.target.files[0].name);
    };

    return (
        <div>
            <div className="form-group preview">
                {<img src={imagePreview} alt='' />}
            </div>
            <div className="form-group">
                <input type="file" className="form-control" accept=".jpg, .jpeg, .png" onChange={(e) => handleFileUpload(e)} />
            </div>
        </div >
    );
}