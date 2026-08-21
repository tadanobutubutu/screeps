// main.js - Fixed with proper <main> landmark for accessibility

export function initializeApp() {
  // Initialize application
  console.log('App initialized');
}

// Existing exports preserved
export const config = {
  name: 'MyApp',
  version: '1.0.0'
};

export function renderApp(container) {
  // Create main element for accessibility
  const main = document.createElement('main');
  main.setAttribute('id', 'main-content');
  main.setAttribute('role', 'main');
  
  // App content
  const appContent = document.createElement('div');
  appContent.textContent = 'Application Content';
  
  main.appendChild(appContent);
  container.appendChild(main);
  
  // Skip link for keyboard navigation
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  container.insertBefore(skipLink, container.firstChild);
}

export default { initializeApp, config, renderApp };