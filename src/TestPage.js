
import React from 'react';
function TestPage({ testStudents }) {


    return (
        <div>
            <h1>Student List</h1>
            <ul>
                {testStudents.map(student => (
                    <li >{student.studentID}: {student.userID} - {student.studentNumber}</li>
                ))}
            </ul>
        </div>
    );
}

export default TestPage;

