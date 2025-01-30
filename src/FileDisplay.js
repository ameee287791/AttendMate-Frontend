import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FileDisplay.css';

const FileDisplay = () => {
    const [data, setData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const userMail = localStorage.getItem('email')

    // only fetches files for teachers
    const fetchFiles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/list-files', {
                params: {
                    userMail: userMail
                }
            });
            setData(response.data);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);


    console.log(data);

    const toggleModal = () => setShowModal(!showModal);

    if (!data) {
        return <div></div>
    }

    const acceptNote = async(note_id) => {
        const response = await fetch(`http://127.0.0.1:5000/doctors_note/decide/${"accept"}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                excuseId: note_id
            }),
        });

        console.log(response);
        fetchFiles();
    }

    const rejectNote = async(note_id) => {
        const response = await fetch(`http://127.0.0.1:5000/doctors_note/decide/${'reject'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                excuseId: note_id
            }),
        });

        console.log(response);
        fetchFiles();
    }

    return (
        <div>
            {Array.isArray(data) && data.length > 0 && (
                <button onClick={toggleModal}>There is doctors notes to review</button>
            )}
            {showModal && (
                <div className="modal">
                    <h3>Uploaded Files</h3>
                    <div className="file-display">
                        {Array.isArray(data) && data.length > 0 ? (
                            data.map((d, index) => (
                                <div key={index} className="file-box">
                                    <p><strong>Student:</strong> {d.name} {d.lastName}</p>  {/* First and Last Name */}
                                    <p><strong>Subject:</strong> {d.subjectName}</p>  {/* Subject Name */}
                                    <p><strong>Date:</strong> {d.date}</p>  {/* Date */}
                                    <a
                                        href={`http://localhost:5000/doctors_notes/${d.filePath}`}
                                        target="_blank"  // Open the file in a new tab
                                        rel="noopener noreferrer"
                                        className="download-link"
                                    >
                                        Doctors Note
                                    </a>
                                    <p className="decision-buttons">
                                        <button onClick={() => acceptNote(d.excuseId)}>Accept</button>
                                        <button onClick={() => rejectNote(d.excuseId)}>Reject</button>
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p>No files available</p>
                        )}

                    </div>
                    <button onClick={toggleModal}>Close</button>
                </div>
            )}
        </div>
    );
};

export default FileDisplay;
