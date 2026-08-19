// main.js - Accessibility improved version

import React from 'react';
import Head from 'next/head';

export default function MainPage() {
  return (
    <>
      <Head>
        <title>Main Page</title>
      </Head>
      
      {/* Header with proper landmark */}
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Main content - only one main landmark per page */}
      <main role="main">
        <h1>Welcome to Our Site</h1>
        
        {/* Proper table structure for accessibility */}
        <table>
          <caption>Product Pricing Information</caption>
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Price</th>
              <th scope="col">Availability</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Widget A</th>
              <td>$19.99</td>
              <td>In Stock</td>
            </tr>
            <tr>
              <th scope="row">Widget B</th>
              <td>$29.99</td>
              <td>Out of Stock</td>
            </tr>
          </tbody>
        </table>

        {/* SVG with accessible name */}
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Close menu"
          role="img"
        >
          <path 
            d="M18 6L6 18M6 6L18 18" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>

        {/* Another SVG example */}
        <svg 
          aria-hidden="true" 
          focusable="false"
          width="16" 
          height="16"
        >
          <title>External link icon</title>
          <use href="#external-link-icon" />
        </svg>

        {/* Proper link vs button usage */}
        <a href="https://example.com" target="_blank" rel="noopener noreferrer">
          Visit External Site
        </a>
        
        {/* If it triggers an action (not navigation), use a button */}
        <button type="button" onClick={() => handleSubmit()}>
          Submit Form
        </button>
      </main>

      {/* Footer landmark - should appear only once */}
      <footer role="contentinfo">
        <p>&copy; 2024 Our Company. All rights reserved.</p>
      </footer>
    </>
  );
}

// Ensure lang attribute is set in your _document.js or _app.js:
// <html lang="en">

// Example _document.js update:
// class MyDocument extends Document {
//   render() {
//     return (
//       <html lang="en">
//         <Head />
//         <body>
//           <Main />
//           <NextScript />
//         </body>
//       </html>
//     );
//   }
// }

export { MainPage };