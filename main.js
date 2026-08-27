import React from 'react';

// New function to wrap the MyTable component with the lang attribute
const AccessibleMyTable = ({ language, children }) => (
  <html lang={language}>
    {children}
  </html>
);

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

export default (geometry) => (
  <AccessibleMyTable language="en">
    <MyTable />
  </AccessibleMyTable>
);