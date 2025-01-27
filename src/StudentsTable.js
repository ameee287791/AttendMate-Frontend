import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import SessionTable from './SessionTable';


function StudentsTable({ maxAbsences }) {

    const { t } = useLanguage();
    const { classNumber } = useParams();
    const userIsProfessor = true;

    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/students/${classNumber}`)
            .then(response => response.json())
            .then(data => setStudents(data))
            .catch(error => console.error('Error fetching data: ', error));
    }, [classNumber])

    const navigate = useNavigate();

    const handleTableClick = (studentNumber) => {
        navigate(`/class/${classNumber}/student/${studentNumber}`, {
            state: {userIsProfessor},
        })
    }

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>{t('number')}</th>
                        <th>{t('lastName')}</th>
                        <th>{t('firstName')}</th>
                        <th>{t('absences')}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.studentID}
                            onClick={() => handleTableClick(student.studentNumber)}
                            style={{
                            color: student.absences > maxAbsences ? 'red' : 'black',
                        }}>
                            <td>{student.studentNumber}</td>
                            <td>{student.lastName}</td>
                            <td>{student.name}</td>
                            <td className="absence">{student.absences}</td>
                            <td className="student-arrow">&#129146;</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <SessionTable>
                
            </SessionTable>
        </div>
    )
}

export default StudentsTable;