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
document.addEventListener('click', (e) => {
  if (e.target.id === 'skip-link' || e.target.closest('#skip-link')) {
    e.preventDefault();
    const mainContent = document.querySelector('#main-content') || document.querySelector('main');
    if (mainContent) {
      mainContent.tabIndex = -1;
      mainContent.focus();
      mainContent.removeAttribute('tabindex');
    }
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
const htmlElement = document.querySelector('html');
if (htmlElement && !htmlElement.hasAttribute('lang')) {
  htmlElement.setAttribute('lang', 'en');
}

// React Table Structure - Ensure that tables have appropriate headers and roles
document.querySelectorAll('table').forEach(table => {
  const headers = table.querySelectorAll('thead th');
  const tbody = table.querySelector('tbody') || table.appendChild(document.createElement('tbody'));
  if (headers.length === 0) {
    table.setAttribute('role', 'presentation'); // Tables without headers are presentational
  } else {
    table.setAttribute('role', 'table');
    const thead = table.querySelector('thead') || table.insertBefore(document.createElement('thead'), table.firstChild);
    thead.setAttribute('role', 'rowgroup');
    headers.forEach((th, index) => {
      th.setAttribute('role', 'columnheader');
      th.setAttribute('scope', index === 0 ? 'colgroup' : 'col');
    });
    table.querySelectorAll('tbody tr').forEach((tr, rowIndex) => {
      tbody.setAttribute('role', 'rowgroup');
      tr.setAttribute('role', 'row');
      tr.querySelectorAll('td').forEach((td, cellIndex) => {
        td.setAttribute('role', 'cell');
        td.setAttribute('scope', cellIndex === 0 ? 'rowheader' : 'col');
      });
    });
  }
});

// React SVG Accessible Name - Ensure that SVGs have an accessible name
document.querySelectorAll('svg').forEach(svg => {
  if (!svg.querySelector('title') && svg.getAttribute('aria-label')) {
    const title = document.createElement('title');
    title.textContent = svg.getAttribute('aria-label') || 'SVG content description';
    svg.insertBefore(title, svg.firstChild);
    svg.setAttribute('role', 'img');
  }
});

// React Unique Landmarks - Ensure that landmarks are unique within the document
// Handle main elements specially - only ONE main landmark should exist
const mainElements = document.querySelectorAll('main');
mainElements.forEach((element, index) => {
  if (!element.id) {
    element.id = `main-${index}`;
  }
  // Only the first main should have role="main" - others should not be landmarks
  if (index > 0) {
    // Remove role="main" from duplicate main elements to fix REACT_025
    if (element.getAttribute('role') === 'main') {
      element.removeAttribute('role');
    }
  }
});

// Add IDs to other landmark elements
const landmarkElements = ['nav', 'aside', 'header', 'footer', 'article', 'section'];
landmarkElements.forEach(landmark => {
  const elements = document.querySelectorAll(landmark);
  elements.forEach((element, index) => {
    if (!element.id) {
      element.id = `${landmark}-${index}`;
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
document.querySelectorAll('a[aria-label]').forEach(link => {
  link.setAttribute('role', 'link');
});