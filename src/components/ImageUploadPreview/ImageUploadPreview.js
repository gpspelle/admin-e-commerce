import React from 'react';
import Compress from 'compress.js';
import { Form } from 'react-bootstrap';

const compress = new Compress();

export default function ImageUploadPreview({ imageInput, imagePreview, setImagePreview, setImages, setImageNames }) {

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
        const base64Images = [];
        const imageNames = [];
        filesAsArray.forEach(async (file) => {
            const base64File = await resizeImageFnAndConvertToBase64(file);
            base64Images.push(base64File);
            imageNames.push(file.name);
        })

        setImages(base64Images);
        setImageNames(imageNames);
    };

    return (
        <Form.Group className="mb-3 preview" controlId="formBasicImages">
            {imagePreview && imagePreview.map((image) => 
                <img key={image.name ? image.name : image} width={256} height={256} src={image.name ? URL.createObjectURL(image) : image} alt='' />
            )}
            <Form.Control ref={imageInput} type="file" multiple={true} className="form-control" accept=".jpg, .jpeg, .png" onChange={(e) => handleFileUpload(e)} />
        </Form.Group>
    );
}