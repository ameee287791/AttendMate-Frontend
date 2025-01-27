import React from 'react';
import StudentProfile from './StudentProfile'; // Import the StudentProfile component
import TeacherProfile from './TeacherProfile'; // Import the TeacherProfile component

const UserAccount = () => {
    const isTeacher = localStorage.getItem('isTeacher') === 'true'; // Retrieve and parse the value from localStorage

    return (
        <div>
            {isTeacher ? <TeacherProfile /> : <StudentProfile />}
        </div>
    );
};

export default UserAccount;