import React from 'react';
import ReactDOM from 'react-dom';

// ... (other imports and code)

const dependencyGraphHtml = `
... (Existing code...)

<thead>
  <tr>
    <th scope="col">Name</th>
    <th scope="col">Type</th>
    <!-- More table headers with scope attributes following this pattern... -->
  </tr>
</thead>
... (Remaining code...)

`;

ReactDOM.render(
  <React.StrictMode>
    <html lang="en">
      <head>
        {/* ... (existing head elements) */}
      </head>
      <body>
        {/* ... (existing body elements) */}
      </body>
    </html>
  </React.StrictMode>,
  document.getElementById('root')
);

module.exports = { dependencyGraphHtml };