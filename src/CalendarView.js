import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import './CalendarView.css';
import './Calendar.css';
import './EditPopup.css';

function CalendarView() {
    const [date, setDate] = useState(new Date());
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [attendance, setAttendance] = useState(new Map()); // map for faster lookup times

    const [status, setStatus] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [hours, setHours] = useState(0);
    const [newHours, setNewHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [newMinutes, setNewMinutes] = useState(0);
    const [dateStr, setDateStr] = useState("");

    const { classNumber } = useParams();
    const { studentNumber } = useParams();



    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/class/${classNumber}/student/${studentNumber}/attendance`)
            .then(response => response.json())
            .then(data => {
                const map = new Map(data.map(item => {
                    const dateKey = item.date.split('T')[0];
                    return [dateKey, item];
                }));
                setAttendance(map);
            })
            .catch(error => console.error('Error fetching data: ', error));
    }, [classNumber, studentNumber]);



    const handleTileClick = (selectedDate) => {
        const localDate = selectedDate.toLocaleDateString('pl-PL').split('T')[0];
        setDateStr(localDate);
        const pair = attendance.get(localDate);
        if (pair == null) {
            setIsPopupOpen(true);
            return
        }

        setDate(selectedDate);

        if (pair) {
            setStatus(pair.status);
            const time = (pair.date).split('T')[1];
            setHours(time.split(':')[0]);
            setMinutes(time.split(':')[1]);
        }

        setIsPopupOpen(true);

    };

    const handleSave = async () => {

        console.log(attendance.get(dateStr));
        // send to database
        const response = await fetch(`http://127.0.0.1:5000/api/update-attendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subjectNumber: classNumber,
                studentNumber: studentNumber,
                date: dateStr,
                status: status
            }),
        });

        console.log(response);

        const pair = attendance.get(dateStr);
        if (pair) {
            pair.status = status;
        }

        // repeat for time
        setIsPopupOpen(false);
    }

    const handleCancel = () => {
        setIsPopupOpen(false);
    }

    const getTileClassName = ({ date }) => {
        const dateStr = date.toLocaleDateString('pl-PL').split('T')[0];
        const pair = attendance.get(dateStr);
        if (pair == null) {
            return "";
        }
        const status = pair.status;

        // note to self: pay attention to if the first letter is big or not !

        if (status === "present") return "tile-present";
        if (status === "late") return "tile-late";
        if (status === "absent") return "tile-absent";
        if (status === "excused") return "tile-excused";
        return "";
    };




    return (
        <div>
            {isPopupOpen && (
                <div className="calendar-edit-popup">
                    <h3>{dateStr}</h3>
                    <label className="status-container">
                        <span>Status:</span>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="none">none</option>
                            <option value="present">present</option>
                            <option value="late">late</option>
                            <option value="absent">absent</option>
                            <option value="excused">excused</option>
                        </select>

                    </label>
                    <div className="time-container">
                        <p>Time: </p>
                        <input
                            type="number"
                            value={hours}
                            onChange={(e) => {
                                if (e.target.value >= 0 && e.target.value < 25) {
                                    setNewHours(e.target.value)
                                }
                            }}
                            className="time-input"
                        />
                        <input
                            type="number"
                            value={minutes}
                            onChange={(e) => {
                                if (e.target.value >= 0 && e.target.value < 60) {
                                    setNewMinutes(e.target.value)
                                }
                            }}
                            className="time-input"
                        />
                    </div>
                    <div className="button-container">
                        <button onClick={handleSave}>Save</button>
                        <button onClick={handleCancel}>Cancel</button>
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
    )
}

export default CalendarView;