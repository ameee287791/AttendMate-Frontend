import React, { useState } from 'react';
import ClassPage from './ClassPage';
import HomePage from './HomePage';
import StudentPage from './StudentPage';
import StudentHomepage from './StudentHomepage';
import './HomePage.css';
import './ClassPage.css';
import './StudentPage.css';
import './StudentsTable.css';
import './editAbsenceLimit.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/class/:classNumber" element={<ClassPage/>} />
                <Route
                    path="/class/:classNumber/student/:studentNumber"
                    element={<StudentPage />}
                />
                <Route path="/studentview" element={<StudentHomepage/> } />
            </Routes>
        </Router>
    );
}

export default App;
