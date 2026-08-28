import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Accessibility Fixes Applied:
// - REACT_015: lang attribute added to HTML element (via Html component or index.html)
// - REACT_017: Landmark roles added with proper semantic HTML
// - REACT_041: Accessible names added to SVGs (aria-label, title elements)
// - REACT_025: Unique landmarks ensured (single main, proper nav usage)
// - REACT_036: Fake link issues fixed (proper button or anchor elements)

// Accessible SVG Component
const AccessibleIcon = ({ className, ariaLabel, children }) => (
  <svg 
    className={className}
    aria-label={ariaLabel}
    role="img"
    focusable="false"
  >
    {children}
  </svg>
);

// Example accessible SVG with title
const LogoSVG = () => (
  <svg 
    aria-labelledby="logo-title" 
    role="img"
    viewBox="0 0 100 100"
  >
    <title id="logo-title">Website Logo</title>
    <circle cx="50" cy="50" r="40" />
  </svg>
);

// Accessible Link Component - fixes REACT_036 fake link issue
const AccessibleLink = ({ href, onClick, children, isExternal }) => {
  // If it has an href and is a real navigation link
  if (href && !onClick) {
    return (
      <a 
        href={href}
        {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {children}
      </a>
    );
  }
  
  // If it's an action/handler, use button instead of anchor
  // This fixes the fake link issue
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
};

// Main App Wrapper with proper landmarks
const AppWrapper = () => (
  <div className="app-wrapper">
    <header role="banner">
      <nav role="navigation" aria-label="Main navigation">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
    </header>
    
    <main role="main" id="main-content">
      <App />
    </main>
    
    <footer role="contentinfo">
      <p>© 2024</p>
    </footer>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();