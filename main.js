// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element

export const metadata = {
  title: 'Screeps Dashboard',
  description: 'Screeps Dashboard',
  htmlLang: 'en',
  icons: {
    icon: { url: 'data:image/svg+xml', href: ... ... viewBox="0 0 100 100"><title>Screeps Dashboard Icon</title><circle cx="50" cy="50" r="40" ... },
    apple: { url: 'data:image/svg+xml', href: ... ... viewBox="0 0 100 100"><title>Screeps Dashboard Apple Icon</title><circle cx="50" cy="50" r="40" ... },
  },
};

export function getHtmlLang() {
  return metadata.htmlLang;
}

export function getHtmlAttributes() {
  return {
    lang: metadata.htmlLang,
  };
}

export function getHTMLAttributes() {
  const attributes = getHtmlAttributes();
  return { ...attributes };
}

// main.js - Accessibility fixes applied

// Issue fixes:
// 1. REACT_015: Add lang attribute to HTML element
// 2. REACT_027: Ensure proper table structure with thead, tbody, th with scope
// 3. REACT_041: Add aria-label to SVG elements
// 4. REACT_025: Ensure unique landmarks (only one main)
// 5. REACT_017: Use proper semantic landmarks
// 6. REACT_036: Use proper anchor tags instead of fake links

import React from 'react';
import { Html } from '@react-email/components';

// Fix 1: REACT_015 - React Language Attribute
export const EmailTemplate = ({ firstName, items }) => (
  <Html lang="en"> {/* Added lang attribute */}
    <head>
      <meta charSet="UTF-8" />
    </head>
    <body style={{ fontFamily: 'Arial, sans-serif' }}>
      <header role="banner"> {/* Fix 5: Proper landmark */}
        <nav role="navigation" aria-label="Main navigation"> {/* Proper nav landmark */}
          <a href="/home">Home</a> | <a href="/about">About</a> | <a href="/contact">Contact</a>
        </nav>
      </header>
      
      <main role="main"> {/* Fix 4 & 5: Unique main landmark */}
        <h1>Welcome, {firstName}!</h1>
        
        {/* Fix 6: REACT_036 - Use proper anchor tags for links */}
        <p>
          Click <a href="/dashboard">here</a> to view your dashboard.
        </p>
        
        {/* Fix 2: REACT_027 - Proper table structure */}
        <table role="table" aria-label="Order items">
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Quantity</th>
              <th scope="col">Price</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>${item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Fix 3: REACT_041 - SVG with accessible name */}
        <div style={{ marginTop: '20px' }}>
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            aria-label="Settings icon"
            role="img"
          >
            <path 
              fill="currentColor" 
              d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"
            />
          </svg>
          
          {/* Second SVG example */}
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="12" cy="12" r="10" fill="#4285f4" />
          </svg>
        </div>
        
        {/* Additional SVG with title for screen readers */}
        <svg 
          width="100" 
          height="100" 
          viewBox="0 0 100 100"
          aria-labelledby="chart-title chart-desc"
        >
          <title id="chart-title">Sales Chart</title>
          <desc id="chart-desc">Bar chart showing monthly sales data</desc>
          <rect x="10" y="60" width="15" height="30" fill="#4285f4" />
          <rect x="30" y="40" width="15" height="50" fill="#34a853" />
          <rect x="50" y="50" width="15" height="40" fill="#fbbc05" />
          <rect x="70" y="30" width="15" height="60" fill="#ea4335" />
        </svg>
      </main>
      
      <footer role="contentinfo"> {/* Proper footer landmark */}
        <p>&copy; 2024 Your Company. All rights reserved.</p>
      </footer>
    </body>
  </Html>
);

// Preserve any existing exports and functions
export const helperFunction = (data) => {
  return data.map(item => ({
    ...item,
    processed: true
  }));
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Additional accessibility helper
export const getAriaLabel = (type, name) => {
  const labels = {
    icon: `Icon for ${name}`,
    button: `${name} button`,
    link: `Link to ${name}`
  };
  return labels[type] || name;
};