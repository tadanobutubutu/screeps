x
import React from 'react';

const MyTable = () => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Column Name</th>
          <th scope="col">Another Column</th>
          {/* ... other headers ... */}
        </tr>
      </thead>
      <tbody>
        {/* ... table rows ... */}
      </tbody>
    </table>
  );
};

export default MyTable;