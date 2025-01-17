//import React from 'react';
//import './HomePage.css';
//import { useNavigate } from 'react-router-dom';



//function EditPopup({ selectedDate, attendanceData }) {

//    const dateObj = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);

//    if (isNaN(dateObj)) {
//        return null;
//    }
//    const dateStr = selectedDate.toLocaleDateString('pl-PL').split('T')[0];

//    if (!selectedDate) {
//        console.log("selectedDate was null");
//        return null;
//    }

//    const pair = attendanceData.find(item => (item.date).split('T')[0] === dateStr);
//    var status = "none";
//    var time = "--:--:--";
//    if (pair) {
//        status = pair.status;
//        time = (pair.date).split('T')[1];
//    }



//    return (
//        <div className="calendar-edit-popup">
//            <h3>{dateStr}</h3>
            //<label>Status:
            //    <select
            //        value={newStatus}
            //        onChange={(e) => setNewStatus(e.target.value)}
            //    >
            //        <option value="present">present</option>
            //        <option value="late">late</option>
            //        <option value="absent">absent</option>
            //        <option value="excused">excused</option>
            //    </select>
            //</label>
//            <p>Time: {time}</p>
            //<div>
            //    <button onClick={handleSave}>Save</button>
            //    <button onClick={handleCancel}>Cancel</button>
            //</div>
//        </div>
//    );
//}

//export default EditPopup;
