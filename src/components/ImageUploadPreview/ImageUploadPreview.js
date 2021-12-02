import React from 'react';
 
export default function ImageUploadPreview( { images, setImages }) {

    return (
        <div>
            <div className="form-group preview">
            </div>
            <div className="form-group">
                <input type="file" className="form-control" onChange={e => setImages(e.target)} />
            </div>
        </div >
    );
}