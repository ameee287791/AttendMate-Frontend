import React, { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';


function CurrentClass() {

    const { t } = useLanguage();
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/students/current-class`)
            .then(response => response.json())
            .then(data => setStudents(data))
            .catch(error => console.error('Error fetching data: ', error));
    }, []); // empty dependency array means fetch only runs once, not 20 times per second

    if (!students || students.length === 0) {
        return <div></div>
    }

    return (
        <div>
            <h1>{t('currentClass')} - {students[0].subjectName}</h1>
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>{t('number')}</th>
                        <th>{t('lastName')}</th>
                        <th>{t('firstName')}</th>
                        <th>{t('status')}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr
                            key={student.studentID}
                            style={{ color: student.status === 'absent' ? 'red' : 'black' }}
                        >
                            <td>{student.studentNumber}</td>
                            <td>{student.lastName}</td>
                            <td>{student.name}</td>
                            <td>{t(student.status)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    )
}

export default CurrentClass;