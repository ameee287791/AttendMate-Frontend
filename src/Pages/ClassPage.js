
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StudentsTable from '../Components/StudentsTable';
import EditAbsenceLimit from '../Components/editAbsenceLimit';
import { useLanguage } from '../LanguageContext';

function ClassPage() {
    const { classNumber } = useParams();
    const { t } = useLanguage();

    const [maxAbsences, setMaxAbsences] = useState(null); // this is here instead of in editAbsenceLimit.js so StudentsTable.js can read it
    const [classItem, setClassItem] = useState(null); // null instead of [] because we only need one class

    useEffect(() => {
        const token = localStorage.getItem('token');

        // Fetch data with token in headers
        fetch(`http://127.0.0.1:5000/api/class/${classNumber}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setClassItem(data);
                setMaxAbsences(data.absenceLimit);
            })
            .catch((error) => console.error('Error fetching data: ', error));
    }, [classNumber]);  // Re-run the effect when classNumber changes

    if (!classItem) {
        return <div>Loading...</div>;
    }


    console.log("Class Type: " + classNumber);

    return (
        <div className='home-container'>
            <div className="header-container">
                <button className="back-button" onClick={() => window.history.back()}>&#129144;</button>
                <h1>
                    {classItem.subjectName}
                    <span className="class-type">{t(classItem.subjectType)}</span>
                </h1>
            </div>
            <EditAbsenceLimit maxAbsences={maxAbsences} setMaxAbsences={setMaxAbsences} classNumber={classNumber} />
            <StudentsTable maxAbsences={maxAbsences} />
        </div>
    );
}

export default ClassPage;