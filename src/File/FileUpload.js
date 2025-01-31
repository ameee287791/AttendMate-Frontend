import React, { useState } from "react";
import axios from "axios";
import { useLanguage } from '../LanguageContext';
import { useParams } from "react-router-dom";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [date, setDate] = useState(new Date());
    const { t } = useLanguage();
    const { classNumber, studentNumber } = useParams();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) return alert(t('pleaseSelectFile'));

        const formData = new FormData();
        formData.append("file", file);

        console.log(classNumber);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("date", date);
            formData.append("studentNumber", studentNumber);
            formData.append("subjectNumber", classNumber);

            const response = await axios.post("http://localhost:5000/upload-file", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log(response)
            alert(t('fileUploaded'));
            setShowForm(false);

        } catch (error) {
            // Check if the error is because of invalid date
            if (error.response && error.response.data.message === 'Invalid date') {
                alert(t('chooseDateWithRecord'));
            } else {
                console.error("Error uploading file:", error);
                alert(t('uploadFailed'));
            }
        }

    };

    const toggleForm = () => {
        setShowForm(!showForm);
    }

    const isTeacher = localStorage.getItem('isTeacher') === 'true';


    return (

        <div>
            {!isTeacher && (
                <button onClick={toggleForm}>
                    { t('uploadNote')}
                </button>
            )}
            {showForm && (
                <div className="calendar-edit-popup">
                    <h3>{t('uploadNote')}</h3>
                    <form onSubmit={handleSubmit} className="upload-form">
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value) } />
                        <input type="file" accept=".pdf" onChange={handleFileChange} />
                        <button type="submit" >{ t('upload')}</button>
                        <button onClick={toggleForm}>{ t('cancel')}</button>
                    </form>
                    <div className="button-container" style={{ paddingTop: "15px" }}>
                    </div>
                </div>


                
            )}
        </div>
    );
};

export default FileUpload;
