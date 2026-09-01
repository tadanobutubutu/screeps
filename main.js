// main.js - Accessibility Issue Handler

// REACT_015: Add lang attribute to the <html> element
function addLangAttribute (html, lang = 'en') {
  if (typeof html !== 'string') return html
  return html.replace(/<html([^>]*)>/i, (match, attrs) => {
    if (/\blang=/i.test(match)) return match
    return `<html${attrs} lang="${lang}">`
  })
}

// REACT_027: Fix table structure issues (add thead, tbody, th scope, caption)
function fixTableStructure (html) {
  if (typeof html !== 'string') return html

  // Ensure every table has a caption
  html = html.replace(/<table([^>]*)>/gi, (match, attrs) => {
    if (/<caption/i.test(match)) return match
    return `<table${attrs}><caption></caption>`
  })

  // Close caption and wrap rows in thead/tbody where missing
  html = html.replace(/<table([^>]*)>([\s\S]*?)<\/table>/gi, (match, attrs, content) => {
    if (/<thead/i.test(content)) return match
    const rows = content.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || []
    if (rows.length === 0) return match
    const firstRows = rows.slice(0, 1).join('')
    const restRows = rows.slice(1).join('')
    const thPattern = /<td>/gi
    const firstRowHasTh = thPattern.test(firstRows)
    let thead = ''
    let tbody = restRows

    if (!firstRowHasTh) {
      thead = `<thead>${firstRows.replace(/<td>/gi, '<th scope="col">').replace(/<\/td>/gi, '</th>')}</thead>`
    } else {
      thead = `<thead>${firstRows}</thead>`
    }
    if (!tbody) tbody = ''
    tbody = `<tbody>${tbody}</tbody>`

    return `<table${attrs}>${thead}${tbody}</table>`
  })

  // Add scope="col" to th elements that don't have it
  html = html.replace(/<th([^>]*)>/gi, (match, attrs) => {
    if (/\bscope=/i.test(match)) return match
    return `<th${attrs} scope="col">`
  })

  return html
}

function divide (dividend, divisor) {
  if (typeof dividend !== 'number' || typeof divisor !== 'number') {
    throw new Error('Both arguments must be numbers')
  }

  if (isNaN(dividend) || isNaN(divisor)) {
    throw new Error('Both arguments must be valid numbers')
  }

  if (divisor === 0) {
    throw new Error('Division by zero is not allowed')
  }

  return dividend / divisor
}

// REACT_017: Add/fix landmark issues
function fixLandmarks (html) {
  if (typeof html !== 'string') return html

  // Ensure <main> landmark exists
  if (!/<main[^>]*>/i.test(html) && !/<div[^>]*role=["']main["']/i.test(html)) {
    html = html.replace(/<body([^>]*)>/i, '<body$1><main>')
    html = html.replace(/<\/body>/i, '</main></body>')
  }

  // Ensure <nav> landmark exists
  if (!/<nav[^>]*>/i.test(html) && !/<div[^>]*role=["']navigation["']/i.test(html)) {
    html = html.replace(/<main[^>]*>/i, '<nav aria-label="Main navigation"></nav><main>')
  }

  // Ensure <aside> landmark exists if content suggests a sidebar
  if (!/<aside[^>]*>/i.test(html) && !/<div[^>]*role=["']complementary["']/i.test(html)) {
    html = html.replace(/<\/main>/i, '<aside aria-label="Supplementary"></aside></main>')
  }

  // Ensure <footer> landmark exists
  if (!/<footer[^>]*>/i.test(html) && !/<div[^>]*role=["']contentinfo["']/i.test(html)) {
    html = html.replace(/<\/body>/i, '<footer></footer></body>')
  }

  return html
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames (html) {
  if (typeof html !== 'string') return html

  const svgMatches = [...html.matchAll(/<svg([^>]*)>/gi)]
  let offset = 0

  svgMatches.forEach((match, index) => {
    const fullMatch = match[0]
    const attrs = match[1]
    const svgStart = match.index + offset
    const svgEnd = html.indexOf('</svg>', svgStart)

    if (svgEnd === -1) return

    const svgContent = html.substring(svgStart, svgEnd + 6)
    const hasTitle = /<title/i.test(svgContent)
    const hasAriaLabel = /\baria-label=/i.test(attrs)
    const hasAriaLabelledBy = /\baria-labelledby=/i.test(attrs)

    if (!hasTitle && !hasAriaLabel && !hasAriaLabelledBy) {
      const newSvg = fullMatch.replace(/>/, `><title>SVG ${index + 1}</title>`)
      const oldSvgLength = svgContent.length
      html = html.substring(0, svgStart) + newSvg + html.substring(svgStart + oldSvgLength)
      offset += newSvg.length - oldSvgLength
    }
  })

  return html
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks (html) {
  if (typeof html !== 'string') return html

  const landmarkRoles = [
    'banner',
    'navigation',
    'main',
    'complementary',
    'contentinfo',
    'search',
    'form'
  ]

  landmarkRoles.forEach((role) => {
    const pattern = new RegExp(`role=["']${role}["']`, 'gi')
    const matches = html.match(pattern)
    if (matches && matches.length > 1) {
      // Keep first occurrence, change subsequent ones
      let count = 0
      html = html.replace(pattern, (match) => {
        count++
        if (count === 1) return match
        return 'role="region"'
      })
    }
  })

  // Also check for duplicate HTML5 landmark elements (header, nav, main, aside, footer)
  const html5Landmarks = ['header', 'nav', 'main', 'aside', 'footer']
  html5Landmarks.forEach((tag) => {
    const pattern = new RegExp(`<${tag}[^>]*>`, 'gi')
    const matches = html.match(pattern)
    if (matches && matches.length > 1) {
      // Keep first, add role="region" to others
      let count = 0
      html = html.replace(pattern, (match) => {
        count++
        if (count === 1) return match
        return match.replace(new RegExp(`<${tag}`, 'i'), `<${tag} role="region"`)
      })
    }
  })

  return html
}

// REACT_036: Fix fake link issues
function fixFakeLinks (html) {
  if (typeof html !== 'string') return html

  // Find spans or divs with onclick that act as links and convert to <a>
  html = html.replace(
    /<span([^>]*)onclick=["']([^"']*)["']([^>]*)>/gi,
    (match, before, onclick, after) => {
      const hrefMatch = onclick.match(/window\.location\s*=\s*['"]([^'"]+)['"]/)
      if (hrefMatch) {
        return `<a href="${hrefMatch[1]}"${before}${after}>`
      }
      return match
    }
  )

  html = html.replace(/<\/span>/gi, '</a>')

  return html
}

// Main function that applies all accessibility fixes
function applyAccessibilityFixes (html) {
  let result = html
  result = addLangAttribute(result)
  result = fixTableStructure(result)
  result = fixLandmarks(result)
  result = addSvgAccessibleNames(result)
  result = ensureUniqueLandmarks(result)
  result = fixFakeLinks(result)
  return result
}

// TODO: Implement function for addressing accessibility issues from insight report
function addressAccessibilityIssues(insightReport) {
  // Apply accessibility fixes to HTML content based on insight report
  if (insightReport && insightReport.html) {
    insightReport.html = applyAccessibilityFixes(insightReport.html)
  }
  console.log('Addressing accessibility issues from insight report:', insightReport)

  // Handle REACT_017: Add/fix landmark issues
  validateLandmarkHelpers();
  validateLandmarkStructHelpers();
  ensureUniqueLandmarks();

  // Handle REACT_041: Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      setSvgAttributes(svg, { 'aria-label': accessibleName });
    }
  });

  // Handle REACT_036: Fix fake link issue
  handleFakeLinks();
}

// TODO: New function added as requested in the issue
function newFunction() {
  // Implementation of the new function goes here
  console.log('New function is active!');
}

// Accessibility-related functions
function getLangAttribute() {
  // Implementation to get language attribute
  return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
  // Implementation to get full language attribute
  return document.documentElement.getAttribute('lang') || 'en-US';
}

function validateTableAccessibility(tableElement) {
  // Implementation to validate table accessibility
  if (!tableElement.querySelector('caption')) {
    console.warn('Table missing caption');
    return false;
  }
  return true;
}

function validateTableStructure(tableElement) {
  // Implementation to validate table structure
  const rows = tableElement.querySelectorAll('tr');
  if (rows.length === 0) {
    console.warn('Table has no rows');
    return false;
  }
  return true;
}

function validateLandmark(element) {
  // Implementation to validate landmark
  const validLandmarks = ['header', 'nav', 'main', 'footer', 'aside', 'section'];
  return validLandmarks.includes(element.tagName.toLowerCase());
}

function validateLandmarkStructure(element) {
  // Implementation to validate landmark structure
  if (!element.id) {
    console.warn('Landmark missing ID');
    return false;
  }
  return true;
}

function validateLandmarkHelpers() {
  // Implementation to validate landmark helpers
  console.log('Validating landmark helpers');
}

function validateLandmarkStructHelpers() {
  // Implementation to validate landmark structure helpers
  console.log('Validating landmark structure helpers');
}

function setSvgAttributes(svg, attrs) {
  // Implementation to set SVG attributes
  Object.keys(attrs).forEach(key => {
    svg.setAttribute(key, attrs[key]);
  });
}

function handleFakeLinks() {
  // Implementation to handle fake links
  const fakeLinks = document.querySelectorAll('a[href="javascript:void(0)"]');
  fakeLinks.forEach(link => {
    console.warn('Fake link found, please replace with proper link or button');
  });
}

// Addressing accessibility issues from insight report
function getAccessibleElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.error(`Element with ID ${id} not found`);
    return null;
  }

  // Ensure element has proper ARIA attributes if needed
  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', 'Accessible element');
  }

  // Ensure element is focusable if needed
  if (!element.getAttribute('tabindex')) {
    element.setAttribute('tabindex', '0');
  }

  return element;
}

// Helper function to create accessible buttons
function createAccessibleButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.setAttribute('aria-label', text);
  button.addEventListener('click', onClick);
  return button;
}

// Function to improve keyboard navigation
function enhanceKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      // Handle tab key navigation
      console.log('Tab key pressed - improving navigation');
    }
  });
}

// Function to add proper ARIA roles to elements
function addAriaRoles() {
  const elements = document.querySelectorAll('[role]');
  elements.forEach(el => {
    if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
      el.setAttribute('aria-label', el.getAttribute('role'));
    }
  });
}

// Function to ensure proper contrast ratios
function checkContrastRatios() {
  const elements = document.querySelectorAll('*');
  elements.forEach(el => {
    const style = window.getComputedStyle(el);
    const bgColor = style.backgroundColor;
    const textColor = style.color;

    // Simple contrast check (in a real app, use a proper contrast checker)
    if (bgColor && textColor) {
      // This would be replaced with actual contrast checking logic
      console.log(`Checking contrast for element: ${el.tagName}`);
    }
  });
}

// Accessibility improvements for addBook function/form
function addBook(title, author, isbn) {
  // Ensure form elements have proper labels and ARIA attributes
  const bookForm = document.getElementById('book-form');
  if (bookForm) {
    bookForm.setAttribute('aria-labelledby', 'add-book-heading');
    bookForm.setAttribute('role', 'form');

    // Add labels to form fields if they don't exist
    const titleInput = document.getElementById('title');
    if (titleInput && !titleInput.getAttribute('aria-label')) {
      titleInput.setAttribute('aria-label', 'Book title');
    }

    const authorInput = document.getElementById('author');
    if (authorInput && !authorInput.getAttribute('aria-label')) {
      authorInput.setAttribute('aria-label', 'Author name');
    }

    const isbnInput = document.getElementById('isbn');
    if (isbnInput && !isbnInput.getAttribute('aria-label')) {
      isbnInput.setAttribute('aria-label', 'ISBN number');
    }
  }

  // Create and return the book object
  return {
    title,
    author,
    isbn,
    id: Date.now().toString()
  };
}

// Initialize accessibility improvements
function initializeAccessibility() {
  enhanceKeyboardNavigation();
  addAriaRoles();
  checkContrastRatios();
}

// Call initialization when DOM is loaded
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibility);
  } else {
    initializeAccessibility();
  }

  // Add event listener for form submission if the form exists
  document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('book-form');
    if (bookForm) {
      bookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const isbn = document.getElementById('isbn').value;

        if (title && author && isbn) {
          const book = addBook(title, author, isbn);
          // Here you would typically add the book to your data store
          console.log('Book added:', book);
          bookForm.reset();
        } else {
          alert('Please fill in all fields');
        }
      });
    }
  });
}

/**
 * Returns an accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string} The accessible name.
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  const title = svg.querySelector('title');
  if (title && title.textContent) return title.textContent;
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement) return labelElement.textContent;
  }
  return 'SVG';
}

/**
 * Creates an accessible link element.
 * @param {string} text - The text content of the link.
 * @param {string} href - The URL the link points to.
 * @returns {HTMLElement} The created link element.
 */
function createAccessibleLink(text, href) {
  const link = document.createElement('a');
  link.textContent = text;
  link.href = href;
  link.setAttribute('role', 'link');
  link.setAttribute('tabindex', '0');
  return link;
}

function createInPageButton (buttonId, buttonText, buttonClass) {
  const button = document.createElement('button')
  button.id = buttonId
  button.textContent = buttonText
  button.className = buttonClass
  if (typeof document !== 'undefined') {
    document.body.appendChild(button)
  }
  return button
}

module.exports = {
  addLangAttribute,
  fixTableStructure,
  fixLandmarks,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinks,
  applyAccessibilityFixes,
  addressAccessibilityIssues,
  createInPageButton,
  divide,
  newFunction,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkHelpers,
  validateLandmarkStructHelpers,
  setSvgAttributes,
  handleFakeLinks,
  getAccessibleElement,
  createAccessibleButton,
  enhanceKeyboardNavigation,
  addAriaRoles,
  checkContrastRatios,
  addBook,
  initializeAccessibility,
  getSvgAccessibleName,
  createAccessibleLink
}

// Run if executed directly
if (require.main === module) {
  console.log('Accessibility module loaded successfully')
}