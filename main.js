// Sample main.js content with JSX tables fixed

import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* Example of a table with fixed <th> scope attribute */}
        <table>
          <thead>
            <tr>
              <th scope="col">Header 1</th>
              <th scope="col">Header 2</th>
              <th scope="col">Header 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Data 1</td>
              <td>Data 2</td>
              <td>Data 3</td>
            </tr>
            {/* More rows */}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;