// main.js
import React from 'react';

const Table = () => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Age</th>
          <th scope="col">City</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>John Doe</td>
          <td>30</td>
          <td>New York</td>
        </tr>
        <tr>
          <td>Jane Smith</td>
          <td>25</td>
          <td>Los Angeles</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Table;