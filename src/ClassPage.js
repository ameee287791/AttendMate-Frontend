
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StudentsTable from './StudentsTable';
import EditAbsenceLimit from './editAbsenceLimit';


function ClassPage() {
    const { classNumber } = useParams();


    const [classItem, setClassItem] = useState(null); // null instead of [] because we only need one class

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/class/${classNumber}`)
            .then(response => response.json())
            .then(data => setClassItem(data))
            .catch(error => console.error('Error fetching data: ', error));
    }, [classNumber]);


    if (!classItem) {
        return <div>Loading...</div>;
    }

    console.log("Class Type: " + classNumber);

    return (
        <div>
            <div className="header-container">
                <button className="back-button" onClick={() => window.history.back()}>&#129144;</button>
                <h1>
                    {classItem.subjectName}
                    <span className="class-type">{classItem.subjectType}</span>
                </h1>
            </div>
            <EditAbsenceLimit absenceLimit={classItem.absenceLimit} classNumber={classNumber } />
            <StudentsTable/>
        </div>
    );
}

export default ClassPage;