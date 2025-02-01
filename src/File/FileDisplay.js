import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FileDisplay.css';
import { useLanguage } from '../LanguageContext';

const FileDisplay = () => {
    const [data, setData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const userMail = localStorage.getItem('email')
    const { t } = useLanguage();

    // only fetches files for teachers
    const fetchFiles = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:5000/list-files', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
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

    const acceptNote = async (note_id) => {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://127.0.0.1:5000/doctors_note/decide/${"accept"}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                excuseId: note_id
            }),
        });

        console.log(response);
        fetchFiles();
    }

    const rejectNote = async (note_id) => {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://127.0.0.1:5000/doctors_note/decide/${'reject'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                excuseId: note_id
            }),
        });

        console.log(response);
        fetchFiles();
    }

    const openFile = async (filePath) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/doctors_notes/${filePath}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                console.error('Failed to fetch file:', response.status);
                return;
            }
            const blob = await response.blob();
            const fileURL = URL.createObjectURL(blob);
            window.open(fileURL, '_blank');
        } catch (error) {
            console.error('Error opening file:', error);
        }
    };


    return (
        <div>
            {Array.isArray(data) && data.length > 0 && (
                <button onClick={toggleModal}>{t('notesToReview')}</button>
            )}
            {showModal && (
                <div className="modal">
                    <h3>{t('doctorsNotes')}</h3>
                    <div className="file-display">
                        {Array.isArray(data) && data.length > 0 ? (
                            data.map((d, index) => (
                                <div key={index} className="file-box">
                                    <p><strong>Student:</strong> {d.name} {d.lastName}</p>  {/* First and Last Name */}
                                    <p><strong>{t('subject')}:</strong> {d.subjectName}</p>  {/* Subject Name */}
                                    <p><strong>{ t('date')}:</strong> {d.date}</p>  {/* Date */}
                                    <button
                                        onClick={() => openFile(d.filePath)}
                                        className="download-link"
                                    >
                                        {t('doctorsNote')}
                                    </button>
                                    <p className="decision-buttons">
                                        <button onClick={() => acceptNote(d.excuseId)}>{t('accept')}</button>
                                        <button onClick={() => rejectNote(d.excuseId)}>{t('reject')}</button>
                                    </p>
                                </div>
                            ))
                        ) : (
                                <p>{ t('noFiles')}</p>
                        )}

                    </div>
                    <button onClick={toggleModal}>{t('close')}</button>
                </div>
            )}
        </div>
    );
};

export default FileDisplay;
