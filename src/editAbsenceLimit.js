
import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';

const EditAbsenceLimit = ({ maxAbsences, setMaxAbsences, classNumber }) => {
    const { t } = useLanguage();

    const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
    const [newMaxAbsences, setNewMaxAbsences] = useState(maxAbsences);

    const handleEditClick = () => {
        setNewMaxAbsences("");
        setIsEditMenuOpen(true);
    }

    const handleSave = async () => {
        if (newMaxAbsences < 0) {
            alert("Please enter a valid number");
            return;
        }
        if (newMaxAbsences === "") {
            setIsEditMenuOpen(false);
            return;
        }
        setMaxAbsences(newMaxAbsences);

        console.log({
            subjectNumber: classNumber,
            absenceLimit: newMaxAbsences,
        });

        const response = await fetch('http://127.0.0.1:5000/api/class/update-absence-limit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                subjectNumber: classNumber,
                absenceLimit: newMaxAbsences,
            }),
        });

        console.log(response);

        setIsEditMenuOpen(false);
    }

    const handleCancel = () => {
        setIsEditMenuOpen(false);
    }

    if (maxAbsences == null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {!isEditMenuOpen && (

                <button className="attendance-limit-button" onClick={() => handleEditClick()}>
                    {t('absenceLimit')}: {maxAbsences} &#x1F589;
                </button>
            )}
            {isEditMenuOpen && (
                <div className="attendance-popup">
                    <h3>{ t('editAbsenceLimit')}</h3>
                    <input
                        type="number"
                        value={newMaxAbsences}
                        onChange={(e) => {
                            if (e.target.value === "") {
                                setNewMaxAbsences("");
                            }
                            else {
                                setNewMaxAbsences(Number(e.target.value))
                            }
                        }}
                    />
                    <div>
                        <button onClick={handleSave}>{t('save')}</button>
                        <button onClick={handleCancel}>{t('cancel')}</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditAbsenceLimit;