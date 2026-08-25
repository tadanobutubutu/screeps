// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

// Skip navigation link for keyboard users
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.id = 'skip-link';
skipLink.className = 'skip-link';
skipLink.textContent = 'Skip to main content';
document.body.insertBefore(skipLink, document.body.firstChild);

// Handle skip link click
skipLink.addEventListener('click', (e) => {
  e.preventDefault();
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.tabIndex = -1;
    mainContent.focus();
    mainContent.removeAttribute('tabindex');
  }
});

// Mark the main content area as a primary region
const mainElement = document.querySelector('main');
if (mainElement) {
  mainElement.id = 'main-content';
  mainElement.setAttribute('role', 'main');
  mainElement.setAttribute('aria-label', 'Main content');
}

// Additional changes to address accessibility issues:

// React Language Attribute - Ensure that the language attribute is set on the HTML element
document.documentElement.lang = 'en';

// React Table Structure - Ensure that tables have appropriate headers and roles
document.querySelectorAll('table').forEach(table => {
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const hasHeaders = thead && thead.querySelector('th');
  
  if (!hasHeaders) {
    table.setAttribute('role', 'presentation'); // Tables without headers are presentational
  } else {
    table.setAttribute('role', 'table');
    
    if (thead) {
      thead.setAttribute('role', 'rowgroup');
      thead.querySelectorAll('th').forEach((th, index) => {
        th.setAttribute('role', 'columnheader');
        th.setAttribute('scope', index === 0 ? 'colgroup' : 'col');
      });
    }
    
    if (tbody) {
      tbody.setAttribute('role', 'rowgroup');
      tbody.querySelectorAll('tr').forEach((tr, rowIndex) => {
        tr.setAttribute('role', 'row');
        tr.querySelectorAll('td').forEach((td, cellIndex) => {
          td.setAttribute('role', 'cell');
          td.setAttribute('scope', cellIndex === 0 ? 'rowgroup' : 'row');
        });
      });
    }
  }
});

// React SVG Accessible Name - Ensure that SVGs have an accessible name
document.querySelectorAll('svg').forEach(svg => {
  const hasTitle = svg.querySelector('title');
  const hasAriaLabel = svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby');
  
  if (!hasTitle && !hasAriaLabel) {
    const title = document.createElement('title');
    title.textContent = 'SVG content description';
    svg.insertBefore(title, svg.firstChild);
    svg.setAttribute('role', 'img');
  }
});

// React Unique Landmarks - Ensure that landmarks are unique within the document
const landmarkElements = ['main', 'nav', 'aside', 'header', 'footer', 'article', 'section'];
landmarkElements.forEach(landmark => {
  const elements = document.querySelectorAll(landmark);
  elements.forEach((element, index) => {
    if (index > 0) {
      element.setAttribute('id', `${landmark}-${index + 1}`);
    }
  });
});

// React Landmarks - Ensure that landmarks are defined
document.querySelectorAll('main').forEach(main => {
  main.setAttribute('role', 'main');
});

document.querySelectorAll('nav').forEach(nav => {
  nav.setAttribute('role', 'navigation');
});

document.querySelectorAll('aside').forEach(aside => {
  aside.setAttribute('role', 'complementary');
});

document.querySelectorAll('header').forEach(header => {
  header.setAttribute('role', 'banner');
});

document.querySelectorAll('footer').forEach(footer => {
  footer.setAttribute('role', 'contentinfo');
});

document.querySelectorAll('article').forEach(article => {
  article.setAttribute('role', 'article');
});

document.querySelectorAll('section').forEach(section => {
  section.setAttribute('role', 'region');
});

// React Fake Link - Ensure that links with `aria-label` are not used as fake links
document.querySelectorAll('[role="link"]').forEach(link => {
  if (link.getAttribute('aria-label')) {
    link.removeAttribute('role');
  }
});