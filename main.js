// Add lang attribute to html element
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <html lang="en">
      <head>
        {/* ... */}
      </head>
      <body>
        <App />
      </body>
    </html>
  </React.StrictMode>,
  document.getElementById('root')
);

// TODO: Add any functions to fix the 4 landmark issues

// TODO: Add functions to provide accessible names to 2 SVGs
import React from 'react';
import logo from './logo.svg';

const Logo = () => (
  <img
    src={logo}
    alt="Logo"
    aria-label="Company logo" // Add an accessible name for the logo
  />
);

// TODO: Ensure unique landmarks (2 issues)
import React from 'react';

const Navbar = () => {
  // ...

  return (
    <nav role="navigation" aria-label="Main Navigation">
      {/* ... */}
    </nav>
  );
};

// TODO: Fix 1 fake link issue
import React from 'react';

const LinkToHome = () => (
  <a href="#" onClick={() => window.location.href = '/'}>
    Home
  </a>
);

// EXPORT THE UPDATED COMPONENTS AND FUNCTIONS
export { App, Header, Footer, Logo, Navbar, LinkToHome };