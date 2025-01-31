import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useLanguage } from '../LanguageContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message , setMessage] = useState('');
    const [token, setToken] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token){
            setToken(token);
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/login', {
                email : email,
                password: password,
            });
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('isTeacher', response.data.isTeacher);
            localStorage.setItem('email', email);
            setIsAuthenticated(true);
            //send user to home page
            window.location.href = '/';
        }
        catch (error) {
            alert('Login failed!');
            console.log(error);
        }
    }

    const handleLogout = () => {
        setToken('');
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    if(isAuthenticated){
        return (
            <div style={{ padding: '20px' }}>
                <h1>{t('login')}</h1>
                <button onClick={handleLogout}>{ t('logout')}</button>
                {message && <p>{message}</p>}
            </div>
        );
    }
    else {
        return (
            <div style={{ padding: '20px' }}>
                <h1>{t('login')}</h1>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>{t('login')}</button>
                <div>
                    {t('noAccount')} <a href="/register">{ t('register')}</a>
                </div>
                <div>
                    try login with email: alicejohnson@example.com
                    and password: student
                </div>
            </div>
        );
    }
}

export default Login;