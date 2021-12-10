import React from 'react';
 
export default function ImageUploadPreview({ imageInput, imagePreview, setImagePreview, setImages, setImageNames }) {
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
        const filesAsArray = [...e.target.files];
        setImagePreview(filesAsArray);
        const base64Images = [];
        const imageNames = [];
        filesAsArray.forEach(async (file) => {
            const base64File = await convertToBase64(file);
            base64Images.push(base64File);
            imageNames.push(file.name);
        })

        setImages(base64Images);
        setImageNames(imageNames);
    };

    return (
        <div>
            <div className="form-group preview">
                {imagePreview && imagePreview.map((image) => 
                    <img key={image.name ? image.name : image} src={image.name ? URL.createObjectURL(image) : image} alt='' />
                )}
            </div>
            <div className="form-group">
                <input ref={imageInput} type="file" multiple={true} className="form-control" accept=".jpg, .jpeg, .png" onChange={(e) => handleFileUpload(e)} />
            </div>
        </div >
    );
}