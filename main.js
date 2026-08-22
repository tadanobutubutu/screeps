// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope attribute to th elements

import React from 'react';
import ReactDOM from 'react-dom/client';

// Accessible main App component
function App() {
  return (
    <div lang="en">
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
      </header>

      <main role="main" id="main-content">
        <h1>Welcome to Our Application</h1>
        
        <section aria-labelledby="section-heading">
          <h2 id="section-heading">Important Information</h2>
          <p>Content goes here</p>
        </section>

        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          aria-label="Search icon"
          role="img"
        >
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>

        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          aria-label="Close button"
          role="img"
        >
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>

        <table>
          <caption>Data Summary</caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Value</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Item 1</th>
              <td>100</td>
              <td>Active</td>
            </tr>
          </tbody>
        </table>

        <a href="/actual-page" className="nav-link">
          Go to actual page
        </a>
      </main>

      <footer role="contentinfo">
        <p>© 2024 Company Name</p>
      </footer>
    </div>
  );
}

// Export for testing
export { App };

// Mount the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);