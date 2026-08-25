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
    const mainContent = document.getElementById('main-content');
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
const htmlElement = document.documentElement;
if (htmlElement && !htmlElement.hasAttribute('lang')) {
  htmlElement.setAttribute('lang', 'en');
}

// React Table Structure - Ensure that tables have appropriate headers and roles
document.querySelectorAll('table').forEach(table => {
  const firstRow = table.querySelector('tr');
  const hasHeaders = firstRow && firstRow.querySelector('th');
  if (!hasHeaders) {
    table.setAttribute('role', 'presentation'); // Tables without headers are presentational
  } else {
    table.setAttribute('role', 'table');
    const tbody = table.querySelector('tbody');
    if (tbody) {
      tbody.setAttribute('role', 'rowgroup');
    }
    table.querySelectorAll('thead th').forEach((th, index) => {
      th.setAttribute('role', 'columnheader');
      th.setAttribute('scope', index === 0 ? 'colgroup' : 'col');
    });
    table.querySelectorAll('tbody tr').forEach(tr => {
      tr.setAttribute('role', 'row');
      tr.querySelectorAll('td, th').forEach((cell, cellIndex) => {
        if (cell.tagName === 'TD') {
          cell.setAttribute('role', 'cell');
          cell.setAttribute('scope', cellIndex === 0 ? 'row' : 'row');
        }
      });
    });
  }
});

// React SVG Accessible Name - Ensure that SVGs have an accessible name
document.querySelectorAll('svg').forEach(svg => {
  if (!svg.querySelector('title') && svg.getAttribute('aria-label')) {
    const title = document.createElement('title');
    title.textContent = svg.getAttribute('aria-label') || 'SVG content description';
    title.setAttribute('id', 'svg-title-' + Math.random().toString(36).substr(2, 9));
    svg.insertBefore(title, svg.firstChild);
    svg.setAttribute('aria-labelledby', title.getAttribute('id'));
  }
});

// React Unique Landmarks - Ensure that landmarks are unique within the document
const landmarkElements = ['main', 'nav', 'aside', 'header', 'footer', 'article', 'section'];
landmarkElements.forEach(landmark => {
  const elements = Array.from(document.querySelectorAll(landmark));
  elements.forEach((element, index) => {
    if (!element.id) {
      element.setAttribute('id', landmark + '-' + (index + 1));
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

// React Fake Link - Ensure that links with `href="#"` are converted to buttons for proper accessibility
document.querySelectorAll('a[href="#"]').forEach(link => {
  // Check if this is not a real navigation link (e.g., skip links are handled separately)
  const isSkipLink = link.id === 'skip-link' || link.classList.contains('skip-link');
  
  if (!isSkipLink && !link.hasAttribute('aria-current') && !link.getAttribute('href').startsWith('#!')) {
    const button = document.createElement('button');
    
    // Copy text content
    button.textContent = link.textContent;
    
    // Copy relevant attributes except href
    Array.from(link.attributes).forEach(attr => {
      if (attr.name !== 'href') {
        button.setAttribute(attr.name, attr.value);
      }
    });
    
    // Copy inline styles
    if (link.style.cssText) {
      button.style.cssText = link.style.cssText;
    }
    
    // Copy classes
    button.className = link.className;
    
    // Copy dataset
    Object.assign(button.dataset, link.dataset);
    
    // Replace the link with button in the DOM
    if (link.parentNode) {
      link.parentNode.replaceChild(button, link);
    }
  } else {
    // For links that should remain as anchors, prevent default hash navigation
    link.addEventListener('click', (e) => {
      e.preventDefault();
      // Custom handling can be added here if needed
    });
  }
});