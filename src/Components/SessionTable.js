import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import './SessionTable.css';

const SessionTable = () => {
    const [tableData, setTableData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { classNumber } = useParams();
    const { t } = useLanguage();

    useEffect(() => {
        const fetchTableData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/students_table/${classNumber}`);
                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.statusText}`);
                }
                const data = await response.json();
                setTableData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTableData();
    }, [classNumber]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!tableData) {
        return <div>No data available</div>;
    }

    const columns = Object.keys(tableData);
    const rows = Object.keys(tableData[columns[0]]);

    // Function to format the date without the year
    const formatDate = (timestamp) => {
        const date = new Date(parseInt(timestamp, 10));
        return date.toLocaleDateString("en", { month: 'short', day: 'numeric' });
    };

    // Function to get the first letter of the value and determine the row color
    const getValueAndColor = (value) => {
        if (!value) return { displayValue: 'N/A', color: 'transparent' };
        const firstLetter = value.charAt(0).toUpperCase();
        switch (firstLetter) {
            case 'A':
                return { displayValue: 'A', color: 'red' };
            case 'P':
                return { displayValue: 'P', color: 'green' };
            case 'E':
                return { displayValue: 'E', color: 'yellow' };
            default:
                return { displayValue: firstLetter, color: 'transparent' };
        }
    };
    
    return (
        <div className="session-table-container">
            <h2>{t('sessionTable')}</h2>
            <table className="session-table">
                <thead>
                    <tr>
                        <th>{t('number')}</th>
                        {columns.map((col) => (
                            <th key={col}>{formatDate(col)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => {
                        const rowValues = columns.map((col) =>
                            getValueAndColor(tableData[col]?.[row])
                        );
    
                        // Determine row color priority: red > yellow > green
                        const rowColor = rowValues.find((val) => val.color === 'red')
                            ? 'red'
                            : rowValues.find((val) => val.color === 'yellow')
                            ? 'yellow'
                            : 'green';
    
                        return (
                            <tr key={row} style={{ backgroundColor: rowColor }}>
                                <td>{row}</td>
                                {rowValues.map((val, index) => (
                                    <td
                                        key={`${row}-${columns[index]}`}
                                        style={{ backgroundColor: val.color }}
                                    >
                                        {val.displayValue}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
export default SessionTable;