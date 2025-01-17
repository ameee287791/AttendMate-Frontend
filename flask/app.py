from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import mysql.connector

app = Flask(__name__)
CORS(app)

def get_db_connection():
    connection = mysql.connector.connect(
        host='localhost',
        user='appuser',
        password='apppassword',
        database='AttendMate'
    )
    return connection

@app.route('/api/classes', methods=['GET'])
def get_classes():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT classID, subjectName, subjectType, subjectNumber FROM class")
    results = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(results)

@app.route('/api/students/<subject_number>', methods=['GET'])
def get_students_by_class(subject_number):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT 
            student.studentNumber,
            student.studentID,
            user.name, 
            user.lastName,
            COALESCE(attendance.absences, 0) AS absences
        FROM student
        JOIN user ON student.userID = user.userID
        JOIN studentsInClasses ON student.studentID = studentsInClasses.studentID
        JOIN class ON studentsInClasses.classID = class.classID
        LEFT JOIN (
            SELECT 
                ar.studentID, 
                COUNT(*) AS absences 
            FROM attendanceRecords ar
            JOIN attendanceStatus ats ON ar.status = ats.attendanceID
            JOIN studentsInClasses ON ar.studentID = studentsInClasses.studentID
            JOIN class ON studentsInClasses.classID = class.classID
            WHERE ats.status = 'absent'
            AND class.subjectNumber = %s
            AND ar.classID = class.classID
            GROUP BY ar.studentID
        ) attendance ON student.studentID = attendance.studentID
        WHERE class.subjectNumber = %s;
        """, (subject_number, subject_number))
    results = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(results)

@app.route('/api/class/<subject_number>', methods=['GET'])
def get_class_by_number(subject_number):
    print(f"ClassPage: Received subject_number: {subject_number}")
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""SELECT classID, subjectName, subjectType, absenceLimit
                   FROM class WHERE subjectNumber = %s""", (subject_number,))
    result = cursor.fetchone()
    cursor.close()
    connection.close()
    return jsonify(result)

@app.route('/api/student/<student_number>', methods=['GET'])
def get_student_by_number(student_number):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""SELECT user.name as name, user.lastName as lastName FROM student
                   JOIN user ON student.userID = user.userID
                   WHERE student.studentNumber = %s""", (student_number,))
    result = cursor.fetchone()
    cursor.close()
    connection.close()
    if result is None:
        return jsonify({"error": "Student not found"}), 404
    return jsonify(result)

@app.route('/api/class/<subject_number>/student/<student_number>/attendance', methods=['GET'])
def get_attendance_by_class_and_student(subject_number, student_number):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    date_format = '%d.%m.%YT%H:%i:%s'
    cursor.execute("""SELECT DATE_FORMAT(CONCAT(attendanceRecords.date, ' ', attendanceRecords.time), %s)  as date, attendanceStatus.status as status
                   FROM attendanceRecords JOIN attendanceStatus
                   ON attendanceRecords.status = attendanceStatus.attendanceID
                   JOIN class ON attendanceRecords.classID = class.classID
                   JOIN student ON attendanceRecords.studentID = student.studentID
                   WHERE student.studentNumber = %s
                   AND class.subjectNumber = %s""", (date_format, student_number, subject_number))
    results = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(results)

#'http://127.0.0.1:5000/api/class/update-absence-limit
@app.route('/api/class/update-absence-limit', methods=['POST'])
def update_absence_limit():
    data = request.get_json()
    print(data) 
    subject_number = data['subjectNumber']
    absence_limit = data['absenceLimit']

    if not subject_number or absence_limit is None:
        return jsonify({"message": "subjectNumber and absenceLimit are required"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE class 
        SET absenceLimit = %s
        WHERE subjectNumber = %s
    """, (absence_limit, subject_number))

    connection.commit()
    cursor.close()
    connection.close()
    
    return jsonify({"message": "Absence limit updated successfully"}), 200


@app.route('/api/update-attendance', methods=['POST'])
def update_attendance():
    data = request.get_json()
    print(data)
    subject_number = data['subjectNumber']
    student_number = data ['studentNumber']
    status = data['status']
    date = data['date']

    if not subject_number or not student_number or status is None:
        return jsonify({"message": "subjectNumber, studentNumber and status are required"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    # convert date back
    date_obj = datetime.strptime(date, '%d.%m.%Y')
    formatted_date = date_obj.strftime('%Y-%m-%d')

    cursor.execute("""
        UPDATE attendanceRecords
        JOIN class ON attendanceRecords.classID = class.classID
        JOIN student ON attendanceRecords.studentID = student.studentID
        SET status = (
            SELECT attendanceID
            FROM attendanceStatus
            WHERE attendanceStatus.status = %s
        )
        WHERE student.studentNumber = %s 
        AND class.subjectNumber = %s
        AND attendanceRecords.date = %s
    """, (status, student_number, subject_number, formatted_date))

    if cursor.rowcount == 0: # no rows updated
        cursor.execute("""
        INSERT INTO attendanceRecords (classID, studentID, date, time, status)
        SELECT class.classID, student.studentID, %s, %s, attendanceStatus.attendanceID
        FROM class JOIN attendanceRecords
        ON class.classID = attendanceRecords.classID
        JOIN student 
        ON student.studentID = attendanceRecords.studentID
        JOIN attendanceStatus ON attendanceStatus.attendanceID = attendanceRecords.status
        WHERE class.subjectNumber = %s
        AND student.studentNumber = %s
        AND attendanceStatus.status = %s
        """, (formatted_date, '13:05:04', subject_number, student_number, status))

    connection.commit()
    cursor.close()
    connection.close()

    return jsonify({"message": "Status updated successfully"}), 200


if __name__ == '__main__':
    app.run(debug=True)
