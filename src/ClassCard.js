import React from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';


function ClassCard({ name, number, type, onClick }) {

    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleCardClick = (classNumber) => {
        navigate(`/class/${classNumber}`);
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
