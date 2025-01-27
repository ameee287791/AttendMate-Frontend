﻿import React, { createContext, useState, useContext } from 'react';


const translations = {
    en: {
        myClasses: "My Classes",
        type: "Type",
        lecture: "Lecture",
        seminar: "Seminar",
        project: "Project",
        lab: "Lab",
        number: "Number",
        absenceLimit: "Absence Limit",
        editAbsenceLimit: "Edit Max Absences",
        lastName: "Last Name",
        firstName: "First Name",
        absences: "Absences",
        present: "Present",
        late: "Late",
        absent: "Absent",
        excused: "Excused",
        none: "None",
        year: "Year",
        semester: "Semester",
        room: "Room",
        day: "Day",
        time: "Time",
        totalLateTime: "Total Late Time",
        timesLate: "Times Student was late",
        averageAttended: "Average Late Time over attended Classes",
        averageLate: "Average Late Time over late Classes",
        totalMissed: "Total Missed Classes",
        totalUnexcused: "Total Unexcused Absences",
        outOfMax1: "out of",
        outOfMax2: "allowed",
        status: "Status",
        save: "Save",
        cancel: "Cancel",
        close: "Close",
        changeLanguage: "polski",
        statistics: "Statistics",
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
        sunday: "Sunday"
    },


    pl: {
        myClasses: "Moje Przedmioty",
        type: "Typ",
        lecture: "Wykład",
        seminar: "Seminarium",
        project: "Projekt",
        lab: "Zajęcia laboratoryjne",
        number: "Numer",
        absenceLimit: "Limit Nieobecności",
        editAbsenceLimit: "Edytuj Limit Nieobecności",
        lastName: "Nazwisko",
        firstName: "Imię",
        absences: "Nieobecności",
        present: "Obecny/a",
        late: "Spóźniony/a",
        absent: "Nieobecny/a",
        excused: "Usprawiedliwiony/a",
        none: "Brak",
        year: "Rok",
        semester: "Semestr",
        room: "Sala",
        day: "Dzień",
        time: "Czas",
        totalLateTime: "Suma Nieobecności",
        timesLate: "Liczba Spóźnień",
        averageAttended: "Średnie Spóźnienie na Obecności",
        averageLate: "Średnie Spóźnienie",
        totalMissed: "Suma Nieobecności",
        totalUnexcused: "Suma Nieusprawiedliwień",
        outOfMax1: "z",
        outOfMax2: "dozwolonych",
        status: "Status",
        save: "Zapisz",
        cancel: "Anuluj",
        close: "Zamknij",
        changeLanguage: "english",
        statistics: "Statystyki",
        monday: "Poniedziałek",
        tuesday: "Wtorek",
        wednesday: "Środa",
        thursday: "Czwartek",
        friday: "Piątek",
        saturday: "Sobota",
        sunday: "Niedziela"
    },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');
    const t = (key) => translations[language][key];


    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
