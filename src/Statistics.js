import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Statistics.css';

function Statistics({ recalculateStats, setRecalculateStats }) {

    const { classNumber, studentNumber } = useParams();
    const [lateTime, setLateTime] = useState(0);
    const [timesInClass, setTimesInClass] = useState(0);
    const [timesLate, setTimesLate] = useState(0);
    const [missedClasses, setMissedClasses] = useState(0);
    const [timesUnexcused, setTimesUnexcused] = useState(0);

    const [classItem, setClassItem] = useState(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/class/${classNumber}/student/${studentNumber}/statistics`)
            .then(response => response.json())
            .then(data => {
                setLateTime(data.lateTime);
                setTimesInClass(data.timesInClass);
                setTimesLate(data.timesLate);
                setMissedClasses(data.missedClasses);
                setTimesUnexcused(data.timesUnexcused);
                setRecalculateStats(false);
            })
            .catch(error => console.error('Error fetching data: ', error));
        fetch(`http://127.0.0.1:5000/api/class/${classNumber}`)
            .then(response => response.json())
            .then(data => setClassItem(data))
            .catch(error => console.error('Error fetching data: ', error));
    }, [classNumber, studentNumber, recalculateStats])

    const convertTimeToSeconds = (time) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    }

    const convertSecondsToTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    console.log(lateTime);

    var lateTimeOverClasses = 0;
    var lateTimeOverLateClasses = 0;

    if (timesInClass > 0) {
        lateTimeOverClasses = convertSecondsToTime(lateTime / timesInClass);
    }

    if (timesLate > 0) {
        lateTimeOverLateClasses = convertSecondsToTime(lateTime / timesLate);
    }

    if (!classItem) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <p className="title"><b> {classItem.subjectName} - Statistics: </b></p>
            <p>
                <span className="class-info">
                    Year: {classItem.year}<br />
                    Semester: {classItem.semester}<br />
                    Room: {classItem.room}<br />
                    Day: {classItem.day}<br />
                    Time: {classItem.time}
                </span>
                <hr className="line" />
                <span className="calculated-statistics">
                    Total Late Time: {convertSecondsToTime(lateTime)}<br />
                    Times Student was late: {timesLate}<br />
                    Average Late Time over attended Classes: {lateTimeOverClasses}<br />
                    Average Late Time over late Classes: {lateTimeOverLateClasses}<br />
                    Total Missed Classes: {missedClasses}<br />
                    <span style={{ color: timesUnexcused > classItem.absenceLimit ? 'red' : 'black' }}>
                        Total Unexcused Absences: {timesUnexcused} (out of {classItem.absenceLimit} allowed)
                    </span>
                </span>
            </p>
        </div>
    )
}

export default Statistics;