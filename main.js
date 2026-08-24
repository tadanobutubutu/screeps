import React from 'react';

const App = () => {
  return (
    <div>
      <h1>Welcome to My Site</h1>
      <p>This is a sample page.</p>

      <table role="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Age</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Alice</td>
            <td>30</td>
          </tr>
          <tr>
            <td>Bob</td>
            <td>25</td>
          </tr>
        </tbody>
      </table>

      <svg aria-label="Sample chart showing growth over time">
        <circle cx="50" cy="50" r="40" stroke="black" stroke-width="2"/>
      </svg>

      <button id="primary-button" onClick={() => console.log('clicked')}>Click me</button>

      <a id="link-to-about" href="/about">About Us</a>
    </div>
  );
};

export default App;