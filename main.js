// Assuming the `main.js` file is a React component that renders the HTML document
import React from 'react';

function App() {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        {/* Rest of the body content */}
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">John Doe</th>
              <td>john@example.com</td>
              <td>Developer</td>
            </tr>
            <tr>
              <th scope="row">Jane Smith</th>
              <td>jane@example.com</td>
              <td>Designer</td>
            </tr>
            <tr>
              <th scope="row">Bob Johnson</th>
              <td>bob@example.com</td>
              <td>Manager</td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}

export default App;