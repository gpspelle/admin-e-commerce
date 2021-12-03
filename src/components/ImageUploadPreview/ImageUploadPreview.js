import React from 'react';
 
export default function ImageUploadPreview( { images, setImages }) {
    var imgPreview;
    if (images) {
        imgPreview = <img src={images} alt='' />;
    } 

    return (
        <div>
            <div className="form-group preview">
                {imgPreview}
            </div>
            <div className="form-group">
                <input type="file" className="form-control" onChange={e => setImages(URL.createObjectURL(e.target.files[0]))} />
            </div>
        </div >
    );
}