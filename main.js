// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element ✓ FIXED
// - REACT_017: Add landmark roles and fix landmark issues ✓ FIXED
// - REACT_041: Add accessible names to 2 SVGs ✓ FIXED
// - REACT_025: Ensure unique landmarks (2 issues) ✓ FIXED
// - REACT_036: Fix 1 fake link issue ✓ FIXED

(function() {
  'use strict';

  // Initialize the application
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    // Set lang attribute on HTML element
    document.documentElement.lang = 'en';

    // Render main application structure with proper landmarks
    renderApp();
    
    // Initialize event handlers
    initEventHandlers();
  }

  function renderApp() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </header>
      
      <main role="main" id="main-content">
        <h1>Welcome to Our Application</h1>
        <p>This is the main content area of the application.</p>
        
        <!-- SVG with accessible name - Issue REACT_041 -->
        <svg role="img" aria-label="Decorative chart icon" width="24" height="24" viewBox="0 0 24 24">
          <rect x="2" y="10" width="4" height="10" fill="currentColor"/>
          <rect x="8" y="6" width="4" height="14" fill="currentColor"/>
          <rect x="14" y="2" width="4" height="18" fill="currentColor"/>
        </svg>
        
        <button type="button" class="action-button">Perform Action</button>
        
        <!-- Second SVG with accessible name - Issue REACT_041 -->
        <svg role="img" aria-labelledby="svg-title" width="100" height="100" viewBox="0 0 100 100">
          <title id="svg-title">User profile illustration</title>
          <circle cx="50" cy="50" r="40" fill="#ccc"/>
          <circle cx="50" cy="40" r="15" fill="#666"/>
          <ellipse cx="50" cy="75" rx="25" ry="15" fill="#666"/>
        </svg>
        
        <div class="info-section">
          <p>Additional information can be found here.</p>
        </div>
      </main>
      
      <footer role="contentinfo">
        <p>&copy; 2024 Application Name. All rights reserved.</p>
        <nav aria-label="Footer navigation">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </nav>
      </footer>
    `;
  }

  function initEventHandlers() {
    // Fixed: Using button element instead of fake link - Issue REACT_036
    const actionButton = document.querySelector('.action-button');
    if (actionButton) {
      actionButton.addEventListener('click', handleAction);
    }

    // Navigation links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
      link.addEventListener('click', handleNavClick);
    });
  }

  function handleAction(event) {
    event.preventDefault();
    console.log('Action triggered');
    // Handle button action
  }

  function handleNavClick(event) {
    const href = event.currentTarget.getAttribute('href');
    console.log('Navigating to:', href);
    // Handle navigation
  }

  // Export functions for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      init,
      renderApp,
      initEventHandlers,
      handleAction,
      handleNavClick
    };
  }
})();