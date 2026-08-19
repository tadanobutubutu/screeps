import React from 'react';

const Table = () => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col"><div>Name</div></th>
          <th scope="col"><div>Age</div></th>
          <th scope="col"><div>City</div></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>John</td>
          <td>30</td>
          <td>New York</td>
        </tr>
        <tr>
          <td>Jane</td>
          <td>25</td>
          <td>Los Angeles</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Table;