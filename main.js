// Before:
// <a id="unrotate" href="#">rotate back</a>

// After:

// main.js - Accessibility-improved application entry point

/**
 * Main application configuration
 * @module main
 */

// ============================================================================
// IMPORTS
// ============================================================================

import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

// ============================================================================
// ROTATE BACK FEATURE
// ============================================================================

function rotateBack() {
  // Your rotate back logic here
  console.log('Rotating back...');
}

// Make sure that the rotateBack function is accessible to the click event listener
// This might mean moving it to a global scope or ensuring it's exported properly

// ============================================================================
// APPLICATION COMPONENT
// ============================================================================

/**
 * Main Application Component
 * @returns {JSX.Element} The main application element
 */
function App() {
  useEffect(() => {
    document.getElementById('unrotate').addEventListener('click', (e) => {
      e.preventDefault();
      // Add the logic that was previously in the href attribute
      // For example, if you had some JavaScript logic to rotate back, you would place it here
      rotateBack();
    });
  }, []);

  return (
    <div lang="en">
      <Header />
      <main id="main-content">
        <HeroSection />
        <ContentSection />
        <Footer />
      </main>
    </div>
  );
}

// ============================================================================
// HEADER COMPONENT
// ============================================================================

/**
 * Site Header with proper landmark and navigation
 * @returns {JSX.Element} Header element with accessible navigation
 */
function Header() {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <header role="banner">
      <div className="logo">
        {/* SVG with accessible name */}
        <svg 
          aria-label="Company Logo" 
          role="img" 
          width="40" 
          height="40" 
          viewBox="0 0 40 40"
          aria-hidden="false"
        >
          <circle cx="20" cy="20" r="18" fill="#007bff" />
          <text x="50%" y="50%" textAnchor="middle" dy=".3em" fill="white">
            L
          </text>
        </svg>
        <span className="site-name">Logo</span>
      </div>
      <Navigation items={navItems} />
      <a id="unrotate" href="#">rotate back</a>
    </header>
  );
}

// ============================================================================
// NAVIGATION COMPONENT
// ============================================================================

/**
 * Accessible Navigation Component
 * @param {Object} props - Component props
 * @param {Array} props.items - Navigation items
 * @returns {JSX.Element} Navigation element
 */
function Navigation({ items }) {
  return (
    <nav aria-label="Main navigation">
      <ul role="list">
        {items.map((item, index) => (
          <li key={index}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ============================================================================
// HERO SECTION COMPONENT
// ============================================================================

/**
 * Hero Section with accessible heading structure
 * @returns {JSX.Element} Hero section element
 */
function HeroSection() {
  return (
    <section aria-labelledby="hero-heading">
      <h1 id="hero-heading">Welcome to Our Platform</h1>
      <p>Discover amazing features and services tailored for you.</p>
      {/* Use real anchor tag instead of button-like div */}
      <a href="/get-started" className="cta-button">
        Get Started
      </a>
    </section>
  );
}

// ============================================================================
// CONTENT SECTION COMPONENT (Addresses Table Structure Issue)
// ============================================================================

/**
 * Content Section with proper table structure
 * @returns {JSX.Element} Content section element
 */
function ContentSection() {
  const tableData = [
    { feature: 'Feature 1', status: 'Available', description: 'Description for feature 1' },
    { feature: 'Feature 2', status: 'Coming Soon', description: 'Description for feature 2' },
    { feature: 'Feature 3', status: 'Available', description: 'Description for feature 3' }
  ];

  return (
    <section aria-labelledby="content-heading">
      <h2 id="content-heading">Features Overview</h2>
      
      {/* Proper table with caption and scope attributes */}
      <table>
        <caption>Features and their current availability status</caption>
        <thead>
          <tr>
            <th scope="col">Feature</th>
            <th scope="col">Status</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <th scope="row">{row.feature}</th>
              <td>{row.status}</td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Secondary accessible table for pricing */}
      <h3 id="pricing-heading">Pricing Plans</h3>
      <table aria-labelledby="pricing-heading">
        <caption>Pricing tiers for our services</caption>
        <thead>
          <tr>
            <th scope="col">Plan</th>
            <th scope="col">Price</th>
            <th scope="col">Features</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Basic</th>
            <td>$9.99/mo</td>
            <td>Basic features included</td>
          </tr>
          <tr>
            <th scope="row">Pro</th>
            <td>$19.99/mo</td>
            <td>Advanced features included</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

// ============================================================================
// FOOTER COMPONENT
// ============================================================================

/**
 * Footer with proper landmark usage
 * @returns {JSX.Element} Footer element
 */
function Footer() {
  return (
    <footer role="contentinfo">
      <div className="footer-content">
        <p>&copy; 2024 Company Name. All rights reserved.</p>
        <nav aria-label="Footer navigation">
          <ul role="list">
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  App,
  Header,
  Navigation,
  HeroSection,
  ContentSection,
  Footer,
  rotateBack
};

export default App;