// src/components/ImageUpload.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import Dropzone from "react-dropzone";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch the list of uploaded images from the backend on component mount

    axios
      .get("http://localhost:5000/getImages")
      .then((res) => {
        const imageUrls = res.data.map((image) => image.url);
        setUploadedImages(imageUrls);
      })
      .catch((error) => {
        console.error("Error fetching images: ", error);
      });
  }, []);

  const handleDrop = (acceptedFiles) => {
    setImage(acceptedFiles[0]);
  };

  const handleUpload = () => {
    if (!image) {
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    axios
      .post("http://localhost:5000/upload", formData)
      .then((res) => {
        setImage(null); // Clear the image state
        setUploadedImages([res.data.url, ...uploadedImages]); // Add the new URL to the array
        setUploadedImageUrl(res.data.url); // Update the image URL state
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error uploading image: ", error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Image Gallery</h1>
      <Dropzone onDrop={handleDrop} accept="image/jpeg, image/png, image/gif">
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            style={{
              border: "2px solid black",
              cursor: "pointer",
              padding: "50px",
              width: "50%",
              margin: "20px auto",
              textAlign: "center",
            }}
          >
            <input {...getInputProps()} />
            {!image && (
              <p
                style={{
                  textAlign: "center",
                  padding: "50px",
                  fontSize: "20px",
                }}
              >
                Drag and drop an image here, or click to select an image
              </p>
            )}
            {loading && <p>Uploading...</p>}
            {!loading && image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                style={{ width: "300px" }}
              />
            )}
          </div>
        )}
      </Dropzone>
      <button
        style={{
          width: "150px",
          height: "50px",
          backgroundColor: loading ? "gray" : "teal",
          color: "white",
          fontSize: "20px",
          cursor: loading ? "not-allowed" : "pointer",
          margin: "20px auto",
          display: "block",
          borderRadius: "5px",
          border: "none",
        }}
        onClick={handleUpload}
      >
        Upload
      </button>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "10%",
          rowGap: "60px",
          padding: "5%",
        }}
      >
        {uploadedImages.map((imageUrl, index) => (
          <div key={index}>
            <h3>Uploaded Image {index + 1}:</h3>
            <img
              src={imageUrl}
              alt={`Uploaded ${index + 1}`}
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                border: "2px solid gray",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
