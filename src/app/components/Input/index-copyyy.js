"use client"
import React, { useState } from 'react';

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Set the image URL to display the image
    setImageUrl(image);
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Submit</button>
      </form>
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
};

export default ImageUploader;
