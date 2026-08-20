import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  return (
    <div id="root" lang="en" role="main">
      <header role="banner">
        <h1 id="app-title">Welcome</h1>
      </header>
      <main id="main-content">
        <p id="description">This is a demo application.</p>
        <table id="data-table">
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
      </main>
    </div>
  );
};

export default App;