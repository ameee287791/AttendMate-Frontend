
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CalendarView from './CalendarView';


function StudentPage() {
    const { studentNumber } = useParams();

    const [student, setStudent] = useState(null);

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
                <CalendarView/>
        </div></>
    );
}

export default StudentPage;