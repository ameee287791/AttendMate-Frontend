import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
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

    return (
        <div className="session-table-container">
            <h2>{t('sessionTable')}</h2>
            <table className="session-table">
                <thead>
                    <tr>
                        <th>{t('number')}</th>
                        {columns.map((col) => (
                            <th key={col}>{new Date(parseInt(col, 10)).toLocaleDateString()}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row}>
                            <td>{row}</td>
                            {columns.map((col) => (
                                <td key={`${row}-${col}`}>
                                    {tableData[col][row] || 'N/A'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SessionTable;