import React from 'react';

const DataTable = () => {
  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'age', label: 'Age' },
    { id: 'email', label: 'Email' }
  ];

  return (
    <>
      <header>
        <h1>Data Table</h1>
      </header>
      <main>
        <table>
          <caption>User Information</caption>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.id} scope="col">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Alice</td>
              <td>25</td>
              <td>alice@example.com</td>
            </tr>
            <tr>
              <td>Bob</td>
              <td>30</td>
              <td>bob@example.com</td>
            </tr>
          </tbody>
        </table>
      </main>
      <footer>
        <p>Data Table Footer</p>
      </footer>
    </>
  );
};

export default DataTable;