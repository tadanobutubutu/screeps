import React from 'react';

const Main = () => {
  return (
    <div lang="en">
      <main id="main-content">
        <h1>Accessible Page</h1>
        <nav aria-label="Main navigation" id="main-nav">
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
        <table>
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
        <svg aria-label="Sample SVG" width="100" height="100">
          <circle cx="50" cy="50" r="40" />
        </svg>
      </main>
    </div>
  );
};

export default Main;