import React from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';


function ClassCard({ name, number, type, userIsProfessor }) {

    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleCardClick = (classNumber) => {
        if (userIsProfessor) {
            navigate(`/class/${classNumber}`);
        } else {
            // studentNumber should be gained from login data
            // dummy data for testing
            navigate(`/class/${classNumber}/student/20230003`, {
                state: { userIsProfessor },
            });
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
