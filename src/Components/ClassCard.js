import React, { useEffect } from 'react';
import '../Pages/HomePage.css';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';


function ClassCard({ name, number, type }) {

    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleCardClick = async (classNumber) => {
        if (localStorage.getItem('isTeacher') === 'true') {
            navigate(`/class/${classNumber}`);
        } else {
            // Get the student's number and navigate to their page
            const email = localStorage.getItem('email');
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/student/${email}`);
                const data = await response.json();

                const studentNumber = data.studentNumber;
                if (studentNumber) {
                    navigate(`/class/${classNumber}/student/${studentNumber}`);
                } else {
                    console.error('Student number not found.');
                }
            } catch (error) {
                console.error('Error fetching student data: ', error);
            }
        }
    };



    return (
        <div className="class-card" onClick={() => handleCardClick(number)}>
          <h2>{name}</h2>
            <p>{t('type')}: {t(type)}</p>
            <p>{t('number')}: {number}</p>
        </div>
  );
}

export default ClassCard;
