
import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {

    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) return alert("Please select a file!");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:5000/upload-file", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(response);
            alert("File uploaded successfully!");
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload file.");
        }
    };

  

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <button type="submit">Upload</button>
        </form>
    );
};

export default FileUpload;