// main.js

/**
 * Adds a book to the collection with accessibility improvements
 * @param {string} title - The title of the book
 * @param {string} author - The author of the book
 * @param {string} isbn - The ISBN of the book
 * @returns {Object} The added book object
 */
function addBook(title, author, isbn) {
    // Validate inputs
    if (!title || !author || !isbn) {
        throw new Error('All fields (title, author, ISBN) are required');
    }

    // Create book object with accessibility attributes
    const book = {
        id: Date.now().toString(),
        title,
        author,
        isbn,
        'aria-label': `Book: ${title} by ${author}`,
        'role': 'listitem'
    };

    // In a real application, you would add this to a books array or database
    // books.push(book);

    return book;
}

/**
 * Renders the add book form with accessibility attributes
 * @returns {HTMLElement} The form element
 */
function renderAddBookForm() {
    const form = document.createElement('form');
    form.setAttribute('role', 'form');
    form.setAttribute('aria-label', 'Add a new book to your collection');

    // Title input
    const titleLabel = document.createElement('label');
    titleLabel.setAttribute('for', 'book-title');
    titleLabel.textContent = 'Book Title:';
    const titleInput = document.createElement('input');
    titleInput.id = 'book-title';
    titleInput.type = 'text';
    titleInput.required = true;
    titleInput.setAttribute('aria-required', 'true');
    titleInput.setAttribute('aria-label', 'Enter the title of the book');

    // Author input
    const authorLabel = document.createElement('label');
    authorLabel.setAttribute('for', 'book-author');
    authorLabel.textContent = 'Author:';
    const authorInput = document.createElement('input');
    authorInput.id = 'book-author';
    authorInput.type = 'text';
    authorInput.required = true;
    authorInput.setAttribute('aria-required', 'true');
    authorInput.setAttribute('aria-label', 'Enter the author of the book');

    // ISBN input
    const isbnLabel = document.createElement('label');
    isbnLabel.setAttribute('for', 'book-isbn');
    isbnLabel.textContent = 'ISBN:';
    const isbnInput = document.createElement('input');
    isbnInput.id = 'book-isbn';
    isbnInput.type = 'text';
    isbnInput.required = true;
    isbnInput.setAttribute('aria-required', 'true');
    isbnInput.setAttribute('aria-label', 'Enter the ISBN of the book');

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Add Book';
    submitButton.setAttribute('aria-label', 'Submit the form to add the book');

    // Assemble form
    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(authorLabel);
    form.appendChild(authorInput);
    form.appendChild(isbnLabel);
    form.appendChild(isbnInput);
    form.appendChild(submitButton);

    // Form submission handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        try {
            const title = titleInput.value;
            const author = authorInput.value;
            const isbn = isbnInput.value;
            const book = addBook(title, author, isbn);
            // In a real app, you would update the UI here
            console.log('Book added:', book);
            form.reset();
        } catch (error) {
            alert(error.message);
        }
    });

    return form;
}

// REACT_015: Add lang attribute to the <html> element
function addLangAttribute(html, lang = 'en') {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (/\blang=/i.test(match)) return match;
        return `<html${attrs} lang="${lang}">`;
    });
}

function addressAccessibilityIssues() {
  // Implement the logic to address new accessibility issues here
  // This is a placeholder for the actual implementation
  console.log('Addressing accessibility issues...');
}

function divide(a, b) {
  if (b === 0) {
    return 0;
  }
  return a / b;
}

// REACT_017: Add/fix landmark issues
function fixLandmarks(html) {
    if (typeof html !== 'string') return html;

    // Ensure <main> landmark exists
    if (!/<main[^>]*>/i.test(html) && !/<div[^>]*role=["']main["']/i.test(html)) {
        html = html.replace(
            /<body([^>]*)>/i,
            '<body$1><main>'
        );
        html = html.replace(/<\/body>/i, '</main></body>');
    }

    // Ensure <nav> landmark exists
    if (!/<nav[^>]*>/i.test(html) && !/<div[^>]*role=["']navigation["']/i.test(html)) {
        html = html.replace(
            /<main[^>]*>/i,
            '<nav aria-label="Main navigation"></nav><main>'
        );
    }

    // Ensure <aside> landmark exists if content suggests a sidebar
    if (!/<aside[^>]*>/i.test(html) && !/<div[^>]*role=["']complementary["']/i.test(html)) {
        html = html.replace(
            /<\/main>/i,
            '<aside aria-label="Supplementary"></aside></main>'
        );
    }

    // Ensure <footer> landmark exists
    if (!/<footer[^>]*>/i.test(html) && !/<div[^>]*role=["']contentinfo["']/i.test(html)) {
        html = html.replace(
            /<\/body>/i,
            '<footer></footer></body>'
        );
    }

    return html;
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames(html) {
    if (typeof html !== 'string') return html;

    const svgMatches = [...html.matchAll(/<svg([^>]*)>/gi)];
    let offset = 0;

    svgMatches.forEach((match, index) => {
        const fullMatch = match[0];
        const attrs = match[1];
        const svgStart = match.index + offset;
        const svgEnd = html.indexOf('</svg>', svgStart);

        if (svgEnd === -1) return;

        const svgContent = html.substring(svgStart, svgEnd + 6);
        const hasTitle = /<title/i.test(svgContent);
        const hasAriaLabel = /\baria-label=/i.test(attrs);
        const hasAriaLabelledBy = /\baria-labelledby=/i.test(attrs);

        if (!hasTitle && !hasAriaLabel && !hasAriaLabelledBy) {
            const newSvg = fullMatch.replace(/>/, `><title>SVG ${index + 1}</title>`);
            const oldSvgLength = svgContent.length;
            html = html.substring(0, svgStart) + newSvg + html.substring(svgStart + oldSvgLength);
            offset += newSvg.length - oldSvgLength;
        }
    });

    return html;
}

function checkLinkAccessibility() {
  // Implementation for checking link accessibility
  // This function will be used to validate the accessibility of links
  const links = document.querySelectorAll('a[href]');
  const issues = [];

  links.forEach(link => {
    const href = link.getAttribute('href');
    const text = link.textContent.trim();

    if (!text) {
      issues.push(`Link with href "${href}" has no accessible text`);
    }
  });

  return issues;
}

// TODO: Implement wrapPrimaryContentInMain function, including the added logic
/**
 * Wraps the primary content of the page in a <main> element for improved accessibility.
 * This function checks if a <main> element already exists; if not, it creates one
 * and moves all body content into it.
 * @returns {Element|null} The <main> element if successfully created/wrapped, or null if body is not available
 */
function wrapPrimaryContentInMain() {
  const body = document.body;

  // Return null if body element is not available
  if (!body) {
    return null;
  }

  // Check if a <main> element already exists to avoid duplication
  const existingMain = document.querySelector('main');
  if (existingMain) {
    return existingMain;
  }

  // Create a new <main> element
  const main = document.createElement('main');

  // Move all existing body children into the <main> element
  while (body.firstChild) {
    main.appendChild(body.firstChild);
  }

  // Append the <main> element to the body
  body.appendChild(main);

  return main;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(html) {
    if (typeof html !== 'string') return html;

    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];

    landmarkRoles.forEach(role => {
        const pattern = new RegExp(`role=["']${role}["']`, 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            // Keep first occurrence, change subsequent ones
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return `role="region"`;
            });
        }
    });

    // Also check for duplicate HTML5 landmark elements (header, nav, main, aside, footer)
    const html5Landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
    html5Landmarks.forEach(tag => {
        const pattern = new RegExp(`<${tag}[^>]*>`, 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            // Keep first, add role="region" to others
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return match.replace(new RegExp(`<${tag}`, 'i'), `<${tag} role="region"`);
            });
        }
    });

    return html;
}

// REACT_036: Fix fake link issues
function fixFakeLinks(html) {
    if (typeof html !== 'string') return html;

    // Find spans or divs with onclick that act as links and convert to <a>
    html = html.replace(
        /<span([^>]*)onclick=["']([^"']*)["']([^>]*)>/gi,
        (match, before, onclick, after) => {
            const hrefMatch = onclick.match(/window\.location\s*=\s*['"]([^'"]+)['"]/);
            if (hrefMatch) {
                return `<a href="${hrefMatch[1]}"${before}${after}>`;
            }
            return match;
        }
    );

    html = html.replace(/<\/span>/gi, '</a>');

    return html;
}

// Main function that applies all accessibility fixes
function applyAccessibilityFixes(html) {
    let result = html;
    result = addLangAttribute(result);
    result = fixTableStructure(result);
    result = fixLandmarks(result);
    result = addSvgAccessibleNames(result);
    result = ensureUniqueLandmarks(result);
    result = fixFakeLinks(result);
    return result;
}

// New function to address accessibility issues
function addressAccessibilityIssues(insightReport) {
  // Apply accessibility fixes to HTML content based on insight report
  if (insightReport && insightReport.html) {
    insightReport.html = applyAccessibilityFixes(insightReport.html);
  }

  // Ensure dependency graph container has proper ARIA role
  ensureDependencyGraphContainerAccessibility();

  // Ensure all landmark elements have unique IDs
  ensureUniqueLandmarkIds();

  // Implement the changes required to address accessibility issues from the insight report
  const linkIssues = checkLinkAccessibility();

  // Handle issues (e.g., log them, display warnings, etc.)
  console.log('Addressing accessibility issues from insight report:', insightReport);
  console.log('Link Accessibility Issues:', linkIssues);

  return {
    success: true,
    message: 'Accessibility issues addressed successfully',
    issues: {
      linkIssues
    }
  };
}

// Function to ensure dependency graph container has proper ARIA role
function ensureDependencyGraphContainerAccessibility() {
  const container = document.querySelector('.dependency-graph-container');
  if (container && !container.hasAttribute('role')) {
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Dependency Graph');
  }
}

// Function to ensure all landmark elements have unique IDs
function ensureUniqueLandmarkIds() {
  const landmarks = [
    { selector: 'header', role: 'banner' },
    { selector: 'nav', role: 'navigation' },
    { selector: 'main', role: 'main' },
    { selector: 'aside', role: 'complementary' },
    { selector: 'footer', role: 'contentinfo' }
  ];

  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark.selector);
    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = `${landmark.role}-${index + 1}`;
      }
    });
  });
}

function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    document.body.appendChild(button);
}

// Don't forget to test your new additions in the test file

// Export accessibility utility functions
export {
  addBook,
  renderAddBookForm,
  addLangAttribute,
  fixTableStructure,
  fixLandmarks,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinks,
  applyAccessibilityFixes,
  addressAccessibilityIssues,
  createInPageButton,
  validateTableAccessibility,
  validateLandmarkStructure,
  getLangAttribute,
  getSvgAccessibleName,
  personName,
  divide,
  checkLinkAccessibility,
  wrapPrimaryContentInMain,
  checkLinkAccessibility,
  addressAccessibilityIssues,
  ensureDependencyGraphContainerAccessibility,
  ensureUniqueLandmarkIds,
  createInPageButton
};