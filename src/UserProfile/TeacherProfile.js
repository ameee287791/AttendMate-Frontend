import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TeacherProfile = () => {
    const [teacherData, setTeacherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
                    <h1>Teacher Profile</h1>
                    <p>Name: {teacherData.name}</p>
                    <p>Last Name: {teacherData.lastName}</p>
                    <button onClick={handleChangePassword}>Change Password</button>
                </div>
            ) : (
                <div>No teacher data found</div>
            )}
        </div>
    );
};

export default TeacherProfile;