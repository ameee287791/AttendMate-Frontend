import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import './CalendarView.css';
import './Calendar.css';
import { useLanguage } from '../LanguageContext';

function CalendarView({ setRecalculateStats }) {
    const { t } = useLanguage();

    const [date, setDate] = useState(new Date());
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [attendance, setAttendance] = useState(new Map()); // map for faster lookup times
    const [status, setStatus] = useState("");
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [dateStr, setDateStr] = useState("");
    const [forbidden, setForbidden] = useState(false); // tracks 403 Forbidden

    const { classNumber } = useParams();
    const { studentNumber } = useParams();

    useEffect(() => {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');

        // Fetch function with token in headers
            const fetchData = () => {
                fetch(`http://127.0.0.1:5000/api/class/${classNumber}/student/${studentNumber}/attendance`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                    .then(response => {
                        if (response.status === 403) {
                            // Set forbidden state if access is denied
                            setForbidden(true);
                            return [];
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (!forbidden) { // Only process data if not forbidden
                            const map = new Map(data.map(item => {
                                const dateKey = item.date.split('T')[0];
                                return [dateKey, item];
                            }));
                            setAttendance(map);
                        }
                    })
                    .catch(error => console.error('Error fetching data: ', error));
            };
        
            fetchData();
        
        }, [classNumber, studentNumber]);

        
    if (forbidden) {
        return <div></div>;
    }

    // opens edit panel for given date
    const handleTileClick = (selectedDate) => {
        const dateStr = selectedDate.toLocaleDateString('pl-PL').split('T')[0];
        const [day, month, year] = dateStr.split('.');
        const formattedDate = `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`;
        setDateStr(formattedDate);
        setDate(selectedDate);

        const pair = attendance.get(formattedDate);

        // open day with no previous entry
        if (pair == null) {
            setStatus("none");
            setHours(0);
            setMinutes(0);
            setIsPopupOpen(true);
            return;
        }

        // open existing entry
        if (pair) {
            setStatus(pair.status);
            const time = (pair.date).split('T')[1];
            setHours(time.split(':')[0]);
            setMinutes(time.split(':')[1]);
        }

        setIsPopupOpen(true);
    };

    // saves changes, closes edit panel
    const handleSave = async () => {
        const token = localStorage.getItem('token');

        if (status === "none") { // delete from database
            const response = await fetch(`http://127.0.0.1:5000/api/delete-attendance-record`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    subjectNumber: classNumber,
                    studentNumber: studentNumber,
                    date: dateStr
                }),
            });
            console.log("Delete: " + response);
        }

        // update or create new in database
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/update-attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    subjectNumber: classNumber,
                    studentNumber: studentNumber,
                    date: dateStr,
                    time: hours + ":" + minutes + ":00",
                    status: status
                }),
            });

            // Parse the JSON response
            const data = await response.json();

            // Check for the specific error message
            if (data.message === "Time is null") {
                alert("Please put in a time");
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }

        const pair = attendance.get(dateStr);

        if (pair) {
            if (status === "none") { // delete entry
                attendance.delete(dateStr);
            } else { // update entry
                pair.status = status;
                console.log("new time: " + (pair.date).split('T')[0] + "T" + hours + ":" + minutes);
                pair.date = (pair.date).split('T')[0] + "T" + hours + ":" + minutes;
            }
        } else { // make new entry
            attendance.set(dateStr, { status: status, date: dateStr + "T" + hours + ":" + minutes });
            console.log("new entry: ");
            console.log(attendance.get(dateStr));
        }

        setRecalculateStats(true); // triggers recalculation of statistics in Statistics.js
        setIsPopupOpen(false);
    };

    const handleCancel = () => {
        setIsPopupOpen(false);
    };

    // class name for styling (color codes)
    const getTileClassName = ({ date }) => {
        const dateStr = date.toLocaleDateString('pl-PL').split('T')[0];
        const [day, month, year] = dateStr.split('.');
        const formattedDate = `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`;
        const pair = attendance.get(formattedDate);
        if (pair == null) {
            return "";
        }
        const status = pair.status;
        if (status == null) return "tile-not-yet";
        if (status === "present") return "tile-present";
        if (status === "late") return "tile-late";
        if (status === "absent") return "tile-absent";
        if (status === "excused") return "tile-excused";
        return "";
    };

    const isTeacher = localStorage.getItem('isTeacher') === 'true';

    return (
        <div className="outer-div">
            {isPopupOpen && isTeacher && (
                <div className="calendar-edit-popup">
                    <h3>{dateStr}</h3>
                    <label className="status-container">
                        <span>{t('status')}:</span>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="none">{t('none')}</option>
                            <option value="present">{t('present')}</option>
                            <option value="late">{t('late')}</option>
                            <option value="absent">{t('absent')}</option>
                            <option value="excused">{t('excused')}</option>
                        </select>
                    </label>
                    <div className="time-container">
                        <p>{t('time')}: </p>
                        <input
                            type="number"
                            value={hours}
                            onChange={(e) => {
                                if (e.target.value >= 0 && e.target.value < 25) {
                                    setHours(e.target.value)
                                }
                            }}
                            className="time-input"
                        />
                        <input
                            type="number"
                            value={minutes}
                            onChange={(e) => {
                                if (e.target.value >= 0 && e.target.value < 60) {
                                    setMinutes(e.target.value)
                                }
                            }}
                            className="time-input"
                        />
                    </div>
                    <div className="button-container">
                        <button onClick={handleSave}>{t('save')}</button>
                        <button onClick={handleCancel}>{t('cancel')}</button>
                    </div>
                </div>
            )}

            {isPopupOpen && !isTeacher && (
                <div className="calendar-edit-popup">
                    <h3>{dateStr}</h3>
                    <label className="status-container">
                        <span>{t('status')}: {t(status)}</span>
                    </label>
                    <div className="button-container" style={{ paddingTop: "15px" }}>
                        <button onClick={handleCancel}>{t('close')}</button>
                    </div>
                </div>
            )}

            {isPopupOpen && !isTeacher && status === 'late' && (
                <div className="calendar-edit-popup">
                    <h3>{dateStr}</h3>
                    <label className="status-container">
                        <span>{t('status')}: {t(status)}</span>
                    </label>
                    <div className="time-container">
                        <p>{t('time')}: {hours}:{minutes}</p>
                    </div>
                    <div className="button-container">
                        <button onClick={handleCancel}>{t('close')}</button>
                    </div>
                </div>
            )}

            <Calendar
                onChange={setDate}
                value={date}
                onClickDay={handleTileClick}
                tileClassName={getTileClassName}
                showNeighboringMonth={false}
            />
        </div>
    );
}

export default CalendarView;
