import React, { useState, useEffect } from 'react';
import ClassPage from './Pages/ClassPage';
import HomePage from './Pages/HomePage';
import StudentPage from './Pages/StudentPage';
import LoginPage from './Pages/LoginPage'; 
import './Pages/HomePage.css';
import './Pages/ClassPage.css';
import './Pages/StudentPage.css';
import './Components/StudentsTable.css';
import './Components/editAbsenceLimit.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Pages/Register';
import Header from './Components/Header';
import UserAccount from './UserProfile/UserAccount';
import ChangePassword from './Pages/ChangePassword';

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

    const isTeacher = localStorage.getItem('isTeacher') === 'true';

    return (
        <Router>
            {isAuthenticated && <TopBar />} {/* Conditionally render the TopBar */}

            <Routes>
                <Route
                    path="/"
                    element={isAuthenticated ? <HomePage /> : <LoginPage />}
                />
                <Route path="/class/:classNumber" element={isAuthenticated && isTeacher ? <ClassPage /> : <LoginPage />} />
                <Route
                    path="/class/:classNumber/student/:studentNumber"
                    element={isAuthenticated ? <StudentPage /> : <LoginPage />}
                />
                <Route path="/user-account" element={isAuthenticated ? <UserAccount /> : <LoginPage />} />
                <Route path="/change-password" element={isAuthenticated ? <ChangePassword /> : <LoginPage />} />

                {/* no login required */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<Register />} />

            </Routes>
        </Router>
    );
}

export default App;