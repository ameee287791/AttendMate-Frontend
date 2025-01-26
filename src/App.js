import React, { useState, useEffect } from 'react';
import ClassPage from './ClassPage';
import HomePage from './HomePage';
import StudentPage from './StudentPage';
import LoginPage from './LoginPage'; // Create a separate LoginPage component
import './HomePage.css';
import './ClassPage.css';
import './StudentPage.css';
import './StudentsTable.css';
import './editAbsenceLimit.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

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
            </Routes>
        </Router>
    );
}

export default App;