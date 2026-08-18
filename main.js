// [Your existing main.js content here]
// ... (all your current code remains unchanged)

// Add the following function to handle the table header scope attributes
function updateTableHeaders() {
  // This function would be called after the DOM is loaded
  // to add scope attributes to table headers
  const headers = document.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      // Default to 'col' scope for most headers
      header.setAttribute('scope', 'col');
      // Special cases for row headers if needed
      if (header.textContent.includes('src/')) {
        header.setAttribute('scope', 'row');
      }
    }
  });
}

// Add function to replace fake links with proper buttons
function replaceFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    if (link.id === 'unrotate') {
      const button = document.createElement('button');
      button.id = link.id;
      button.textContent = link.textContent;
      button.className = link.className;
      button.addEventListener('click', (e) => {
        e.preventDefault();
        // Add your rotation logic here
        console.log('Rotation triggered');
      });
      link.parentNode.replaceChild(button, link);
    }
  });
}

// Call the functions when the DOM is fully loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    updateTableHeaders();
    replaceFakeLinks();
  });
}

// [Rest of your existing main.js content here]
// ... (all your current code remains unchanged)

// Add this function to ensure only one main element exists
function ensureSingleMainElement() {
  // Check if there are multiple main elements
  const mainElements = document.getElementsByTagName('main');
  if (mainElements.length > 1) {
    // Keep the first main element and remove others
    for (let i = 1; i < mainElements.length; i++) {
      const parent = mainElements[i].parentNode;
      const wrapper = document.createElement('section');
      // Copy all attributes from the main element to the section
      Array.from(mainElements[i].attributes).forEach(attr => {
        wrapper.setAttribute(attr.name, attr.value);
      });
      // Move all children to the wrapper
      while (mainElements[i].firstChild) {
        wrapper.appendChild(mainElements[i].firstChild);
      }
      // Replace the main element with the section
      parent.replaceChild(wrapper, mainElements[i]);
    }
  }
}

// Add the single main element check to DOMContentLoaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    ensureSingleMainElement();
  });
}

// Add this function to ensure all content is wrapped in a main element
function ensureMainLandmark() {
  // Check if there's already a main element
  if (document.querySelector('main')) {
    return;
  }

  // Find the main content container
  const content = document.querySelector('.container') ||
                 document.querySelector('table') ||
                 document.querySelector('body > *:not(script):not(style):not(link)');

  if (content) {
    // Create a main element
    const main = document.createElement('main');

    // Move all content to the main element
    while (content.firstChild) {
      main.appendChild(content.firstChild);
    }

    // Replace the content with the main element
    content.parentNode.replaceChild(main, content);
  }
}

// Add the main landmark check to DOMContentLoaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    ensureMainLandmark();
  });
}

// Add this function to handle SVG accessibility
function makeSVGsAccessible() {
  // Find all SVG elements in the document
  const svgs = document.querySelectorAll('svg');

  svgs.forEach(svg => {
    // Skip if SVG already has accessibility attributes
    if (svg.hasAttribute('aria-label') ||
        svg.hasAttribute('aria-hidden') ||
        svg.querySelector('title') ||
        svg.querySelector('desc')) {
      return;
    }

    // Check if SVG is decorative (no semantic meaning)
    const isDecorative = svg.closest('a, button') === null &&
                         !svg.hasAttribute('role') &&
                         !svg.hasAttribute('aria-labelledby');

    if (isDecorative) {
      // Mark as decorative if it has no interactive context
      svg.setAttribute('aria-hidden', 'true');
    } else {
      // Add a title element for non-decorative SVGs
      const title = document.createElement('title');
      title.textContent = 'Graphic element';
      svg.insertBefore(title, svg.firstChild);
    }
  });
}

// Add SVG accessibility check to DOMContentLoaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    makeSVGsAccessible();
  });
}

// Add this function to ensure the HTML element has a lang attribute
function ensureHtmlLangAttribute() {
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// Add the HTML lang attribute check to DOMContentLoaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    ensureHtmlLangAttribute();
  });
}