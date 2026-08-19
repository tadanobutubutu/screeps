// main.js
import React from 'react';

// Add lang attribute to HTML element (REACT_015)
document.documentElement.lang = 'en';

// Example component with accessibility fixes
const AccessibleComponent = () => {
  // REACT_017 - Proper landmark elements
  return (
    <div>
      <header>
        <h1>Website Header</h1>
      </header>

      <nav aria-label="Main navigation">
        <ul>
          <li><a href="/home">Home</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>

      <main>
        {/* REACT_027 - Proper table structure */}
        <table>
          <caption>User Data</caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>john@example.com</td>
            </tr>
          </tbody>
        </table>

        {/* REACT_041 - Accessible SVG */}
        <svg aria-label="Decorative icon" role="img">
          <circle cx="50" cy="50" r="40" fill="red" />
        </svg>

        {/* REACT_036 - Proper link/button usage */}
        <a href="/contact">Contact Us</a>
        <button onClick={() => console.log('Action')}>Click Me</button>
      </main>

      <footer>
        <p>© 2023 Company Name</p>
      </footer>
    </div>
  );
};

// REACT_025 - Ensure unique landmarks
const AnotherComponent = () => {
  return (
    <div>
      <nav aria-label="Secondary navigation">
        <ul>
          <li><a href="/help">Help</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default AccessibleComponent;
export { AnotherComponent };