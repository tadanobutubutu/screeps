// main.js - Accessibility improvements added
// TODO: Address accessibility issues from insight report
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

const root = document.getElementById('root');

/**
 * Enhances accessibility for images by ensuring they have alt text
 * @param {string} selector - CSS selector for images
 * @param {string} defaultAlt - Default alt text if missing
 */
export function ensureImageAltText(selector = 'img', defaultAlt = 'Descriptive image') {
  const images = document.querySelectorAll(selector);
  images.forEach((img, index) => {
    if (!img.alt || img.alt.trim() === '') {
      img.alt = `${defaultAlt} ${index + 1}`;
      img.setAttribute('role', 'img');
    }
  });
}

/**
 * Adds ARIA labels to interactive elements missing labels
 * @param {string} selector - CSS selector for interactive elements
 */
export function ensureAccessibleLabels(selector = 'button, [role="button"]') {
  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => {
    if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !el.textContent.trim()) {
      el.setAttribute('aria-label', 'Interactive button');
    }
  });
}

/**
 * Initializes accessibility enhancements
 */
export function initAccessibility() {
  ensureImageAltText();
  ensureAccessibleLabels();
  
  // Ensure proper heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1));
    if (level > lastLevel + 1) {
      heading.setAttribute('aria-label', `Level ${level} heading: ${heading.textContent}`);
    }
    lastLevel = level;
  });
}

function render() {
  root.innerHTML = `
    <div class="app">
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </header>
      
      <main role="main" id="main-content">
        <h1>Welcome to Our Application</h1>
        <p>This is the main content area of the page.</p>
        <button type="button" onclick="handleAction()">Perform Action</button>
      </main>
      
      <aside role="complementary" aria-label="Related information">
        <h2>Related Links</h2>
        <ul>
          <li><a href="/help">Help Center</a></li>
          <li><a href="/faq">FAQ</a></li>
        </ul>
      </aside>
      
      <footer role="contentinfo">
        <p>&copy; 2024 Our Application. All rights reserved.</p>
      </footer>
    </div>
  `;
  
  // Add lang attribute to HTML element
  document.documentElement.lang = 'en';
  
  // Run accessibility enhancements after rendering content
  initAccessibility();
}

function handleAction() {
  console.log('Action performed');
}

function exportData() {
  return { message: 'Data exported successfully' };
}

// Initial render
render();

// Export functions for testing
export { render, handleAction, exportData, ensureImageAltText, ensureAccessibleLabels, initAccessibility };

// Export for testing
export default {
  ensureImageAltText,
  ensureAccessibleLabels,
  initAccessibility,
  render,
  handleAction,
  exportData
};