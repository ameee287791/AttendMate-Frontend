
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CalendarView from './CalendarView';
import Statistics from './Statistics';

function StudentPage() {
    const { studentNumber } = useParams();

    const [student, setStudent] = useState(null);
    const [recalculateStats, setRecalculateStats] = useState(false);

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/student/${studentNumber}`)
            .then(response => response.json())
            .then(data => setStudent(data))
            .catch(error => console.error('Error fetching data: ', error));
    }, [studentNumber])

    if (!student) {
        return <div>Loading...</div>;
    }

    console.log("Student:" + student);

    return (
        <><div className="header-container">
            <button className="back-button" onClick={() => window.history.back()}>&#129144;</button>
            <h1>
                {student.name} {student.lastName}
                <span className="student-number">{studentNumber}</span>
            </h1>
        </div>
            <div className="main-body">
                <div className="legend-container">
                    <div className="legend-cube" style={{ backgroundColor: '#4CAF50' }} />
                    <p>Present</p>
                    <div className="legend-cube" style={{ backgroundColor: '#FF9800' }} />
                    <p>Late</p>
                    <div className="legend-cube" style={{ backgroundColor: '#F44336' }} />
                    <p>Absent</p>
                    <div className="legend-cube" style={{ backgroundColor: '#4856D4' }} />
                    <p>Excused</p>
                </div>
                <div className="lower-body">
                    <div className="calendar-container">
                        <CalendarView setRecalculateStats={setRecalculateStats} />
                    </div>
                    <div className="stats-container">
                        <Statistics recalculateStats={recalculateStats} setRecalculateStats={setRecalculateStats} />
                    </div>
                </div>
            </div></>
    );
}

export default StudentPage;