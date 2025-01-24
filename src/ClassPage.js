
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StudentsTable from './StudentsTable';
import EditAbsenceLimit from './editAbsenceLimit';
import Header from './Header';
import { useLanguage } from './LanguageContext';

function ClassPage() {
    const { classNumber } = useParams();
    const { t } = useLanguage();

    const [maxAbsences, setMaxAbsences] = useState(null); // this is here instead of in editAbsenceLimit.js so StudentsTable.js can read it


    const [classItem, setClassItem] = useState(null); // null instead of [] because we only need one class

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/class/${classNumber}`)
            .then(response => response.json())
            .then((data) => {
                setClassItem(data);
                setMaxAbsences(data.absenceLimit);
            })
            .catch(error => console.error('Error fetching data: ', error));
    }, [classNumber]);


    if (!classItem) {
        return <div>Loading...</div>;
    }


    console.log("Class Type: " + classNumber);

    return (
        <div>
            <Header />
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