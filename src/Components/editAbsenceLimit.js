
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

const EditAbsenceLimit = ({ maxAbsences, setMaxAbsences, classNumber }) => {
    const { t } = useLanguage();

    const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
    const [newMaxAbsences, setNewMaxAbsences] = useState(maxAbsences);
    const [isValidTeacher, setIsValidTeacher] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch(`http://127.0.0.1:5000/api/is-teacher-of-class/${classNumber}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // Send JWT token
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                setIsValidTeacher(data);
            })
            .catch(error => console.error('Error fetching data: ', error));

    }, [classNumber])

    console.log(isValidTeacher);

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

        const token = localStorage.getItem('token'); // Retrieve the token from local storage

        const response = await fetch('http://127.0.0.1:5000/api/class/update-absence-limit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include JWT token in the request
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

    if (isValidTeacher === false) {
        return <div></div>
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