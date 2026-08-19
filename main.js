import React from 'react';

// Hypothetical table component with <th> elements lacking scope attribute
const MyTable = () => {
  return (
    <main>
      <table>
        <thead>
          <tr>
            <th scope="col">Column 1</th>
            <th scope="col">Column 2</th>
            <th scope="col">Column 3</th>
          </tr>
        </thead>
        <tbody>
          {/* Table rows with data cells */}
        </tbody>
      </table>
    </main>
  );
};

export default MyTable;