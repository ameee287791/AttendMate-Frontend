import React, {useState, useEffect} from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message , setMessage] = useState('');
    const [token, setToken] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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
            setIsAuthenticated(true);
            alert('Login successful!');
        }
        catch (error) {
            alert('Login failed!');
        }
    }

    const handleLogout = () => {
        setToken('');
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    }

    if(isAuthenticated){
        return (
            <div style={{ padding: '20px' }}>
                <h1>Login</h1>
                <button onClick={handleLogout}>Logout</button>
                {message && <p>{message}</p>}
            </div>
        );
    }
    else {
        return (
            <div style={{ padding: '20px' }}>
                <h1>Login</h1>
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
                <button onClick={handleLogin}>Login</button>
                <div>
                    Don't have an account? <a href="/register">Register</a>
                </div>
            </div>
        );
    }
}

export default Login;