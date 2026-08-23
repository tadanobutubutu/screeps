// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

(function() {
  'use strict';

  // Add lang attribute to HTML element
  document.documentElement.lang = 'en';

  function initializeApp() {
    const appContainer = document.getElementById('app');
    
    if (!appContainer) {
      console.error('App container not found');
      return;
    }

    appContainer.innerHTML = `
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
        
        <!-- Accessible SVG Icons -->
        <svg role="img" aria-labelledby="icon-search-title" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <title id="icon-search-title">Search icon</title>
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
          <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        
        <svg role="img" aria-labelledby="icon-user-title" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <title id="icon-user-title">User profile icon</title>
          <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
          <path d="M4 20C4 17.2386 7.58172 15 12 15C16.4183 15 20 17.2386 20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        
        <p>Click the button below to get started:</p>
        
        <!-- Fixed fake link to proper button -->
        <button type="button" onclick="handleClick()" aria-describedby="action-description">
          Get Started
        </button>
        <span id="action-description" class="visually-hidden">
          This button will trigger the main action of the page
        </span>
      </main>
      
      <aside role="complementary" aria-label="Related content">
        <h2>Related Information</h2>
        <p>Additional resources and links</p>
      </aside>
      
      <footer role="contentinfo">
        <p>&copy; 2024 Our Application. All rights reserved.</p>
      </footer>
    `;

    // Add CSS for accessibility
    const style = document.createElement('style');
    style.textContent = `
      .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      
      [role="banner"],
      [role="navigation"],
      [role="main"],
      [role="complementary"],
      [role="contentinfo"] {
        display: block;
      }
    `;
    document.head.appendChild(style);
  }

  function handleClick() {
    console.log('Button clicked - main action triggered');
    // Main action logic here
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }

  // Export for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeApp, handleClick };
  }

  // Make functions globally accessible if needed
  window.App = {
    initializeApp,
    handleClick
  };
})();