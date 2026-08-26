import React from 'react';

const MyTableComponent = ({ headers }) => {
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} scope="col">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* ... table rows ... */}
      </tbody>
    </table>
  );
};

export default MyTableComponent;