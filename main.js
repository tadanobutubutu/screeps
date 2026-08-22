import React from 'react';
import PropTypes from 'prop-types';

// Example component for demonstration
const MyTable = () => {
  return (
    <table lang="en" id="employee-table">
      <caption>Employee List</caption>
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Role</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Alice</td>
          <td>Admin</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Bob</td>
          <td>User</td>
        </tr>
      </tbody>
    </table>
  );
};

// Navigation section with landmark
<nav aria-label="Main navigation">
  <ul>
    <li><a href="#overview">Overview</a></li>
    <li><a href="#details">Details</a></li>
  </ul>
</nav>

// Summary section
<section aria-label="Summary">
  <p>This is a summary section.</p>
</section>

// SVG icons with accessible names
<svg viewBox="0 0 24 24" width="48" height="48" xmlns="http://www.w3.org/2000/svg" aria-label="Edit button">
  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
</svg>

<svg viewBox="0 0 24 24" width="48" height="48" xmlns="http://www.w3.org/2000/svg" aria-label="Delete button">
  <path d="M19 6L9 12H4l-5 4h11z"/>
</svg>

// Main application component
function App() {
  return (
    <div>
      <header role="banner">
        <h1>Insight Report</h1>
      </header>
      <main role="main">
        <MyTable />
        <nav aria-label="Main navigation">
          <ul>
            <li><a href="#overview">Overview</a></li>
            <li><a href="#details">Details</a></li>
          </ul>
        </nav>
        <section aria-label="Summary">
          <p>This is a summary section.</p>
        </section>
        <svg viewBox="0 0 24 24" width="48" height="48" xmlns="http://www.w3.org/2000/svg" aria-label="Edit button">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
        <svg viewBox="0 0 24 24" width="48" height="48" xmlns="http://www.w3.org/2000/svg" aria-label="Delete button">
          <path d="M19 6L9 12H4l-5 4h11z"/>
        </svg>
      </main>
    </div>
  );
}

export default App;