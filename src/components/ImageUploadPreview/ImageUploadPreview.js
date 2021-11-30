import React, { useState } from 'react';
import axios from 'axios';
 
export default function ImageUploadPreview() {
    const [file, setFile] = useState();

    var imgPreview;
    if (file) {
        imgPreview = <img src={file} alt='' />;
    } 

    return (
        <div>
            <div className="form-group preview">
                {imgPreview}
            </div>
            <div className="form-group">
                <input type="file" className="form-control" onChange={e => setFile(URL.createObjectURL(e.target.files[0]))} />
            </div>
        </div >
    );
}