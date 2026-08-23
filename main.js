tsx
import React from 'react';

const Layout = () => {
  const icons = {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><title>Screeps Dashboard</title><text y=".9em" font-size="90">🐛</text></svg>',
    apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><title>Screeps Dashboard</title><text y=".9em" font-size="90">🐛</text></svg>',
  };
  // your existing code here...

  return (
    // Assuming this is a table component where the issue occurs
    <table>
      <thead>
        <tr>
          {Object.keys(icons).map((key) => (
            <th scope="col" key={key}>
              <div>{key}</div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* Table body content */}
      </tbody>
    </table>
  );
};

export default Layout;