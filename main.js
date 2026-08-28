// main.js
import React from 'react';

const Main = () => {
  return (
    <div lang="en">
      <header role="banner" aria-label="Main header">
        <h1>Welcome</h1>
      </header>
      <nav aria-label="Main navigation">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
      <main aria-label="Main content">
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
          </tbody>
        </table>
        <svg role="img" aria-label="Sample icon">
          <title>Sample icon</title>
          <circle cx="50" cy="50" r="40" />
        </svg>
        <a href="#" role="link">Click here</a>
      </main>
      <footer role="contentinfo" aria-label="Footer">
        <p>Footer content</p>
      </footer>
    </div>
  );
};

export default Main;