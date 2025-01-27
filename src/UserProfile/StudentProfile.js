import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const StudentProfile = () => {
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchStudentData = async () => {
            const email = localStorage.getItem('email');

            if (!email) {
                setError("Email not found in localStorage");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:5000/api/student/${email}`);
                if (!response.ok) {
                    throw new Error('Student not found');
                }
                const data = await response.json();
                setStudentData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, []);

    // Function to handle the "Change Password" button click
    const handleChangePassword = () => {
        navigate('/change-password'); // Navigate to the change password form
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {studentData ? (
                <div>
                    <h1>Student Profile</h1>
                    <p>Name: {studentData.name}</p>
                    <p>Last Name: {studentData.lastName}</p>
                    <button onClick={handleChangePassword}>Change Password</button>
                </div>
            ) : (
                <div>No student data found</div>
            )}
        </div>
    );
};

export default StudentProfile;