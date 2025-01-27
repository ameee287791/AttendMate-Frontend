
import React, { useEffect, useState } from 'react';
import ClassCard from './ClassCard';
import Header from './Header';
import { useLanguage } from './LanguageContext';
function StudentHomepage() {

    const { t } = useLanguage();
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const studentNumber = 20230003;
        fetch(`http://127.0.0.1:5000/api/classes/${studentNumber}`)
            .then(response => response.json())
            .then(data => setClasses(data))
            .catch(error => console.error('Error fetching data: ', error));
    })


    return (
        <div>
            <Header />
            <h1>{t('myClasses')}</h1>
            <div className="class-list">
                {classes.map(cls => (
                    <ClassCard
                        key={cls.classID}
                        name={cls.subjectName}
                        type={cls.subjectType}
                        number={cls.subjectNumber}
                        userIsProfessor={false}
                    />
                ))}
            </div>
        </div>
    );
}

export default StudentHomepage;

