// main.js

// Application initialization
const init = () => {
  setupEventListeners();
  setupPage();
  setupLanguage();
};

// Set up event listeners
const setupEventListeners = () => {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Application initialized');
  });
};

// Set up the page
const setupPage = () => {
  const header = document.querySelector('header');
  const main = document.querySelector('main');
  const footer = document.querySelector('footer');

  if (header) {
    header.classList.add('site-header');
  }

  if (main) {
    main.classList.add('site-main');
  }

  if (footer) {
    footer.classList.add('site-footer');
  }
};

// Set up language
const setupLanguage = () => {
  const htmlElement = document.documentElement;
  const language = htmlElement.lang || 'en';
  htmlElement.setAttribute('lang', language);
};

// Initialize the app when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', init);
}

// Export for testing
module.exports = {
  init,
  setupEventListeners,
  setupPage,
  setupLanguage
};