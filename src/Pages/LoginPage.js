import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../LanguageContext';
import './LoginPage.css'; // Import the CSS file

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [token, setToken] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setToken(token);
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/login', {
                email: email,
                password: password,
            });
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('isTeacher', response.data.isTeacher);
            localStorage.setItem('email', email);
            setIsAuthenticated(true);
            window.location.href = '/';
        } catch (error) {
            alert('Login failed!');
            console.log(error);
        }
    };

    const handleLogout = () => {
        setToken('');
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    if (isAuthenticated) {
        return (
            <div className="login-container">
                <h1 className="login-heading">{t('login')}</h1>
                <button onClick={handleLogout} className="logout-button">{t('logout')}</button>
                {message && <p className="message">{message}</p>}
            </div>
        );
    } else {
        return (
            <div className="login-container">
                <h1 className="login-heading">{t('login')}</h1>
                <div className='form-group'>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <button onClick={handleLogin} className="login-button">{t('login')}</button>
                </div>
                <div className="account-link">
                    {t('noAccount')} <a href="/register">{t('register')}</a>
                </div>
                <div className="test-credentials">
                    {t('testCredentials')} <br />
                    {t('email')}: alicejohnson@example.com <br />
                    {t('password')}: student
                </div>
            </div>
        );
    }
};

export default Login;