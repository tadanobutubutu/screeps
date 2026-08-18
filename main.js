import React from 'react';

const TableComponent = () => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Role</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Alice</td>
          <td>Developer</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Bob</td>
          <td>Designer</td>
        </tr>
      </tbody>
    </table>
  );
};

const TablePage = ({ isLoading, error }) => {
  if (error) {
    return (
      <article role="alert">
        <h1>Error</h1>
        <p>{error}</p>
      </article>
    );
  }

  if (isLoading) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <main>
      <h1>Table View</h1>
      <TableComponent />
    </main>
  );
};

export { TableComponent, TablePage };
export default TableComponent;