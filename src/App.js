import React, { useState, useEffect } from 'react';
import ClassPage from './ClassPage';
import HomePage from './HomePage';
import StudentPage from './StudentPage';
import LoginPage from './LoginPage'; 
import StudentHomepage from './StudentHomepage';
import './HomePage.css';
import './ClassPage.css';
import './StudentPage.css';
import './StudentsTable.css';
import './editAbsenceLimit.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Register';
import Header from './Header';
import UserAccount from './UserProfile/UserAccount';
import ChangePassword from './ChangePassword';

function TopBar() {
    return (
        <div className="top-bar">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/register">Register</a></li>
                <li><a href="/login">Login</a></li>
                <li><a href="/user-account">User Account</a></li>
                <li><Header/></li>
            </ul>
        </div>
    );
}

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <Router>
            {isAuthenticated && <TopBar />} {/* Conditionally render the TopBar */}

            <Routes>
                <Route
                    path="/"
                    element={isAuthenticated ? <HomePage /> : <LoginPage />}
                />
                <Route path="/class/:classNumber" element={<ClassPage />} />
                <Route
                    path="/class/:classNumber/student/:studentNumber"
                    element={<StudentPage />}
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/user-account" element={<UserAccount/>} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/studentview" element={<StudentHomepage/> } />
            </Routes>
        </Router>
    );
}

export default App;