import React from 'react';

const Main = () => {
  return (
    <div role="root">
      <h1>Welcome</h1>
      <p>This is the main page.</p>
      <table role="table">
        <thead>
          <tr>
            <th scope="col">Column 1</th>
            <th scope="col">Column 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Row 1 Col 1</td>
            <td>Row 1 Col 2</td>
          </tr>
        </tbody>
      </table>
      <svg aria-label="Sample graphic">
        <circle cx="50" cy="50" r="40" stroke="black" fill="red" />
      </svg>
      <a href="/about">About</a>
    </div>
  );
};

export default Main;