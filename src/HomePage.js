
import React, { useEffect, useState } from 'react';
import ClassCard from './ClassCard';
import { useLanguage } from './LanguageContext';
function HomePage() {

    const { t } = useLanguage();
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/classes')
            .then(response => response.json())
            .then(data => setClasses(data))
            .catch(error => console.error('Error fetching data: ', error));
    }, [])

    //console.log("Classes: " +   classes);

    return (
        <div className="App">
            <h1>{t('myClasses')}</h1>
            <div className="class-list">
                {classes.map(cls => (
                    <ClassCard
                        key={cls.classID}
                        name={cls.subjectName}
                        type={cls.subjectType}
                        number={cls.subjectNumber}
                    />
                ))}
            </div>
        </div>
    );
}

export default HomePage;

