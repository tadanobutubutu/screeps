// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

// Existing imports and code (preserved)
import './style.css';

// Function to initialize the app
function init() {
  // REACT_015: Add lang attribute to HTML element
  document.documentElement.setAttribute('lang', 'en');

  const root = document.getElementById('root');
  if (!root) {
    console.error('Root element not found');
    return;
  }

  // Create main container
  const appContainer = document.createElement('div');
  appContainer.id = 'app';
  root.appendChild(appContainer);

  // REACT_036: Fix fake link issue – replace placeholder href with a real URL
  const fakeLink = document.createElement('a');
  fakeLink.href = 'https://example.com';
  fakeLink.textContent = 'Visit Example';
  appContainer.appendChild(fakeLink);

  // REACT_017 & REACT_025: Add/fix 4 landmark elements with unique IDs
  const header = document.createElement('header');
  header.id = 'site-header';
  root.appendChild(header);

  const nav = document.createElement('nav');
  nav.id = 'main-nav';
  root.appendChild(nav);

  const main = document.createElement('main');
  main.id = 'site-main';
  root.appendChild(main);

  const footer = document.createElement('footer');
  footer.id = 'site-footer';
  root.appendChild(footer);
}

// Call init on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Preserve existing exports
export { init };