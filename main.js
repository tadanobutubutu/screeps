// main.js
import React from 'react';

// Add lang attribute to root element
function App() {
  return (
    <div lang="en"> {/* REACT_015 - Added language attribute */}
      {/* REACT_017 - Added proper landmarks */}
      <header role="banner">
        <h1>Your Application</h1>
      </header>

      <main role="main">
        {/* REACT_027 - Proper table structure */}
        <table>
          <thead>
            <tr>
              <th scope="col">Header 1</th>
              <th scope="col">Header 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Data 1</td>
              <td>Data 2</td>
            </tr>
          </tbody>
        </table>

        {/* REACT_041 - Accessible SVG */}
        <svg aria-label="Example graphic" width="100" height="100">
          <circle cx="50" cy="50" r="40" fill="red" />
        </svg>

        {/* REACT_036 - Proper link/button */}
        <button onClick={() => console.log('Clicked')}>Click Me</button>
      </main>

      <footer role="contentinfo">
        Footer content
      </footer>
    </div>
  );
}

// Keep all existing exports
export default App;
export const existingFunction = () => {
  // Your existing code here
};