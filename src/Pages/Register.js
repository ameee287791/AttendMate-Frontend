import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting
import axios from 'axios';
import { useLanguage } from '../LanguageContext';

const Register = () => {
    const [email, setEmail] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate(); // Used for redirection
    const { t } = useLanguage();

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
                    { t('alreadyLoggedIn')}
                </div>
            </div>
        )
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>{ t('register')}</h1>
            <div>
                <div>{ t('inputUniEmail')}</div>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <button onClick={handleRegister}>{t('register')}</button>
        </div>
    );
};

export default Register;