import React from 'react';

const Main = () => {
  return (
    <div>
      {/* REACT_015: Ensure html lang attribute is set, e.g., in _document.js */}
      <main>
        <h1>Accessibility Fixed Page</h1>
        {/* REACT_027: Proper table structure */}
        <table>
          <thead>
            <tr>
              <th>Column 1</th>
              <th>Column 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Data 1</td>
              <td>Data 2</td>
            </tr>
          </tbody>
        </table>
        {/* REACT_041: SVG accessible name */}
        <svg aria-label="Sample SVG" width="100" height="100">
          <circle cx="50" cy="50" r="40" />
        </svg>
        {/* REACT_025 & REACT_017: Use unique landmarks, e.g., one main */}
        <nav aria-label="Main navigation">
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
        {/* REACT_036: Avoid fake links, use button for actions */}
        <button onClick={() => alert('Clicked')}>Click me</button>
      </main>
    </div>
  );
};

export default Main;