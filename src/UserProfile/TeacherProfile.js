import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {teacherData ? (
                <div>
                    <h1>{t('teacherProfile')}</h1>
                    <p>{t('firstName')}: {teacherData.name}</p>
                    <p>{t('lastName')}: {teacherData.lastName}</p>
                    <button onClick={handleChangePassword}>{t('changePassword')}</button>
                </div>
            ) : (
                <div>No teacher data found</div>
            )}
        </div>
    );
};

export default TeacherProfile;