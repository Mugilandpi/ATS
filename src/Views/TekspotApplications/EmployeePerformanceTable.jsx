import React from 'react';
import './EmployeePerformanceTable.css'; // Import the CSS file

const EmployeePerformanceTable = () => {
    const data = [
        { id: 1, name: 'Employee A', performance: 'Excellent' },
        { id: 2, name: 'Employee B', performance: 'Good' },
        { id: 3, name: 'Employee C', performance: 'Average' },
        // Add more employee data as needed
    ];

    return (
        <table className="employee-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Performance</th>
                </tr>
            </thead>
            <tbody>
                {data.map((employee) => (
                    <tr key={employee.id}>
                        <td>{employee.id}</td>
                        <td>{employee.name}</td>
                        <td>{employee.performance}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default EmployeePerformanceTable;
