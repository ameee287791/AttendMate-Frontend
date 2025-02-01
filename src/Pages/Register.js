import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../LanguageContext';
import './Register.css';

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
            <div className="auth-container">
                <div>{t('alreadyLoggedIn')}</div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="form-group">
                <h1 class="big-text">{t('register')}</h1>
                <div className="form-group">
                    <label className="form-label">{t('inputUniEmail')}</label>
                    <input
                        type="email"
                        placeholder="Enter your university email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                    />
                </div>
                <button onClick={handleRegister} className="submit-button">
                    {t('register')}
                </button>
                <div className="account-link">
                    {t('haveAccount')} <a href="/login">{t('login')}</a>
                </div>
            </div>
        </div>
    );
};

export default Register;