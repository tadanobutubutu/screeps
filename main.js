// Updated main.js to address accessibility issues
import React from 'react';

const Main = () => {
  return (
    <div>
      <main>
        <h1>Accessibility Fixed</h1>
        <nav aria-label="Primary">
          <a href="/">Home</a>
        </nav>
        <table>
          <thead>
            <tr>
              <th>Header</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Data</td>
            </tr>
          </tbody>
        </table>
        <svg aria-label="Example" />
        <a href="/about">About</a>
      </main>
    </div>
  );
};

export default Main;