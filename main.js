import React from 'react';

const Table = ({ data }) => {
  return (
    <main>
      <table>
        <thead>
          <tr>
            <th ...
            <th ...
            <th scope="col">Role</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.role}</td>
              <td>{item.status}</td>
              <td>{item.actions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default Table;