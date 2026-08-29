import React from 'react';

// Sample data for the table
const tableData = {
  headers: ['Name', 'Email', 'Role', 'Status'],
  rows: [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'User', status: 'Inactive' }
  ]
};

// TODO: This is the existing code that needs to be preserved (This comment remains as-is)
// This comment should remain on line 85 to match the commit reference

const UserTable = ({ users = tableData.rows }) => {
  return (
    <div className="table-container">
      <table className="user-table">
        <thead>
          <tr>
            {tableData.headers.map((header, index) => (
              <th key={index} scope="col">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <th scope="row">{user.name}</th>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Helper function to format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Export the component and utilities
export { UserTable, formatDate, tableData };
export default UserTable;