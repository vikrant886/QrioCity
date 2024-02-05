// eslint-disable-next-line

import React, { useState } from "react";
import {UserRound} from "lucide-react"

export default function ImageContainer({onImagechange}) {
    const [image,setImage]= useState()

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log(file);
        if (file) { //converting image to base64
            const reader = new FileReader();
            reader.onload = function (event) {
                setImage(event.target.result);
                onImagechange(event.target.result)
            };
            reader.readAsDataURL(file);
        } else {
            setImage(null);
        }
    };

    const triggerFileInput = () => {
        document.getElementById('fileInput').click();
    };
    return (
        <div className="flex justify-center h-32 items-center">
            <div
                id="imageContainer"
                onClick={triggerFileInput}
                className="w-20 h-20 rounded-full flex justify-center items-center dark:bg-transparent shadow-darkcards bg-whitetext overflow-hidden hover:w-24 hover:h-24 hover:duration-500 duration-300"
            >
                {image ? (
                    <img
                        src={image}
                        alt="Uploaded Image"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                ) : (
                    <>
                    <UserRound size={60} className="text-white"/>
                    </>
                )}
            </div>

            <input
                type="file"
                id="fileInput"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </div>
    )
}