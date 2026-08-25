import React from 'react';

const MyTable = () => {
  const headers = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'location', label: 'Location' },
  ];

  const rows = [
    { name: 'Alice', age: 24, location: 'New York' },
    { name: 'Bob', age: 30, location: 'California' },
    // ... more rows
  ];

  return (
    <table>
      <thead>
        <tr>
          {headers.map(header => (
            <th scope="col" key={header.key}>
              {header.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.name}>
            <td>{row.name}</td>
            <td>{row.age}</td>
            <td>{row.location}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MyTable;