import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Statistics.css';
import { useLanguage } from '../LanguageContext';

function Statistics({ recalculateStats, setRecalculateStats }) {
    const { t } = useLanguage();
    const { classNumber, studentNumber } = useParams();
    const [lateTime, setLateTime] = useState(0);
    const [timesInClass, setTimesInClass] = useState(0); // late or present
    const [timesLate, setTimesLate] = useState(0);
    const [missedClasses, setMissedClasses] = useState(0); // absent or excused
    const [timesUnexcused, setTimesUnexcused] = useState(0); // absent
    const [classItem, setClassItem] = useState(null);
    const [forbidden, setForbidden] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        // Fetch statistics data with token in headers
        fetch(`http://127.0.0.1:5000/api/class/${classNumber}/student/${studentNumber}/statistics`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (response.status === 403) {
                    setForbidden(true);
                    return null;
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    setLateTime(data.lateTime);
                    setTimesInClass(data.timesInClass);
                    setTimesLate(data.timesLate);
                    setMissedClasses(data.missedClasses);
                    setTimesUnexcused(data.timesUnexcused);
                    setRecalculateStats(false);
                }
            })
            .catch(error => console.error('Error fetching statistics: ', error));

        // Fetch class item (for subject details)
        fetch(`http://127.0.0.1:5000/api/class/${classNumber}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (response.status === 403) {
                    setForbidden(true);
                    return null;
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    setClassItem(data);
                }
            })
            .catch(error => console.error('Error fetching class data: ', error));
    }, [classNumber, studentNumber, recalculateStats, setRecalculateStats, token]);

    if (forbidden) {
        return <div>Not allowed</div>;
    }

    // Utility functions to convert time formats
    const convertTimeToSeconds = (time) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    const convertSecondsToTime = (seconds) => {
        seconds = Math.round(seconds);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    console.log(lateTime);

    let lateTimeOverClasses = "";
    let lateTimeOverLateClasses = "";

    if (timesInClass > 0) {
        lateTimeOverClasses = convertSecondsToTime(lateTime / timesInClass);
    }

    if (timesLate > 0) {
        lateTimeOverLateClasses = convertSecondsToTime(lateTime / timesLate);
    }

    const totalClasses = timesInClass + missedClasses;
    const attendancePercentage = totalClasses > 0 ? ((timesInClass / totalClasses) * 100).toFixed(2) : 0;

    if (!classItem) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <p className="title"><b>{classItem.subjectName} - {t('statistics')}:</b></p>
            <div className="statistics-container">
                <div className="class-info">
                    <p>
                        {t('year')}: {classItem.year}<br />
                        {t('semester')}: {classItem.semester}<br />
                        {t('room')}: {classItem.room}<br />
                        {t('day')}: {t(classItem.day)} <br />
                        {t('time')}: {classItem.time}<br />
                    </p>
                </div>
                <div className="calculated-statistics">
                    <p>{t('totalLateTime')}: {convertSecondsToTime(lateTime)}</p>
                    <p>{t('timesLate')}: {timesLate}</p>
                    <p>{t('averageAttended')}: {lateTimeOverClasses}</p>
                    <p>{t('averageLate')}: {lateTimeOverLateClasses}</p>
                    <p>{t('totalMissed')}: {missedClasses}</p>
                    <p>{t('attendancePercentage')}: {attendancePercentage}%</p>
                    <span style={{ color: timesUnexcused > classItem.absenceLimit ? 'red' : 'green' }}>
                        {t('totalUnexcused')}: {timesUnexcused} ({t('outOfMax1')} {classItem.absenceLimit} {t('outOfMax2')})
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Statistics;
