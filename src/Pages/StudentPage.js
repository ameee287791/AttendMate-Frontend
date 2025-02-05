
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CalendarView from '../Calendar/CalendarView';
import Statistics from '../Components/Statistics';
import FileUpload from '../File/FileUpload';
import { useLanguage } from '../LanguageContext';

function StudentPage() {

    const { t } = useLanguage();
    const { classNumber, studentNumber } = useParams();

    const [student, setStudent] = useState(null);
    const [classItem, setClassItem] = useState(null);
    const [recalculateStats, setRecalculateStats] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Retrieve token from storage
    
        fetch(`http://127.0.0.1:5000/api/student/by-number/${studentNumber}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // Send JWT token
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => setStudent(data))
        .catch(error => console.error('Error fetching data: ', error));
    }, [studentNumber]);

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/class/${classNumber}`)
            .then(response => response.json())
            .then(data => setClassItem(data))
            .catch(error => console.error('Error fetching data: ', error));
    }, [classNumber])

    if (!student || !classItem) {
        return <div>Loading...</div>;
    }

    console.log("Student: ");
    console.log(student);
    console.log(studentNumber);

    const isTeacher = localStorage.getItem('isTeacher') === 'true';

    return (
        <>
        <div className='home-container'>
        <div className="header-container">
            <button className="back-button" onClick={() => window.history.back()}>&#129144;</button>

            {isTeacher && (
                <h1>
                    {student.name} {student.lastName}
                    <span className="student-number">{studentNumber}</span>
                </h1>
            )}

            {!isTeacher && (
                <h1>
                    {classItem.subjectName}
                    <span className="student-number">{classNumber}</span>
                </h1>
            )}
        </div>
            <div className="main-body ">
                <div className="legend-container">
                    <div className="legend-cube" style={{ backgroundColor: '#4CAF50' }} />
                    <p>{t('present')}</p>
                    <div className="legend-cube" style={{ backgroundColor: '#FF9800' }} />
                    <p>{t('late')}</p>
                    <div className="legend-cube" style={{ backgroundColor: '#F44336' }} />
                    <p>{t('absent')}</p>
                    <div className="legend-cube" style={{ backgroundColor: '#4856D4' }} />
                    <p>{t('excused')}</p>
                    <div className="legend-cube" style={{ backgroundColor: 'lightgray' }} />
                    <p>{t('notYet')}</p>
                    <div className="upload-container">
                        <FileUpload/>
                    </div>
                </div>
                <div className="lower-body">
                    <div className="calendar-container">
                        <CalendarView setRecalculateStats={setRecalculateStats}/>
                    </div>
                    <div className="stats-container">
                        <Statistics recalculateStats={recalculateStats} setRecalculateStats={setRecalculateStats} />
                    </div>
                </div>
            </div>
            </div>
            </>
    );
}

export default StudentPage;