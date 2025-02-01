import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import './TeacherProfile.css'; // Import the CSS file

const TeacherProfile = () => {
    const [teacherData, setTeacherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { t } = useLanguage();

    useEffect(() => {
        const fetchTeacherData = async () => {
            const email = localStorage.getItem('email');

            if (!email) {
                setError("Email not found in localStorage");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:5000/api/teacher/${email}`);
                if (!response.ok) {
                    throw new Error('Teacher not found');
                }
                const data = await response.json();
                setTeacherData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherData();
    }, []);

    const handleChangePassword = () => {
        navigate('/change-password');
    };

    if (loading) {
        return <div className="loading">{t('loading')}...</div>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    return (
        <div className="teacher-profile-container">
            {teacherData ? (
                <div className="profile-details">
                    <h1 className="profile-heading">{t('teacherProfile')}</h1>
                    <p><strong>{t('firstName')}:</strong> {teacherData.name}</p>
                    <p><strong>{t('lastName')}:</strong> {teacherData.lastName}</p>
                    <button onClick={handleChangePassword} className="change-password-button">{t('changePassword')}</button>
                </div>
            ) : (
                <div className="no-data">{t('noTeacherData')}</div>
            )}
        </div>
    );
};

export default TeacherProfile;