import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting
import axios from 'axios';

const Register = () => {
    const [email, setEmail] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate(); // Used for redirection

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/register', {
                email: email,
            });
            alert(response.data.message); // Display success message
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed!');
        }
    };

    if (isAuthenticated) {
        return (
            <div style={{ padding: '20px' }}>
                <div>
                    You are already logged in.
                </div>
            </div>
        )
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Register</h1>
            <div>
                <div>Put your university email address below to register.</div>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <button onClick={handleRegister}>Register</button>
        </div>
    );
};

export default Register;