// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

/**
 * REACT_015: Generate HTML document with lang attribute
 * @param {string} title - Page title
 * @param {string} bodyContent - HTML content for body
 * @returns {string} Complete HTML document
 */
function createHTMLDocument(title, bodyContent) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
${bodyContent}
</body>
</html>`;
}

/**
 * REACT_017 & REACT_025: Generate header with proper landmark and unique label
 * @param {string} logoText - Logo content
 * @param {string} navContent - Navigation HTML
 * @returns {string} Header element with landmark
 */
function createHeader(logoText, navContent) {
  return `<header class="site-header" role="banner" aria-label="Site header">
  <div class="logo">
    ${logoText}
  </div>
  <nav class="main-nav" aria-label="Main navigation">
    ${navContent}
  </nav>
</header>`;
}

/**
 * REACT_017 & REACT_025: Generate main element with proper landmark and unique label
 * @param {string} content - Main content HTML
 * @returns {string} Main element with landmark
 */
function createMain(content) {
  return `<main class="main-content" role="main" aria-label="Main content">
  ${content}
</main>`;
}

/**
 * REACT_017 & REACT_025: Generate footer with proper landmark and unique label
 * @param {string} footerContent - Footer content
 * @returns {string} Footer element with landmark
 */
function createFooter(footerContent) {
  return `<footer class="site-footer" role="contentinfo" aria-label="Site footer">
  ${footerContent}
</footer>`;
}

/**
 * REACT_041: Generate SVG with accessible name
 * @param {string} svgId - Unique identifier for the SVG
 * @param {string} svgContent - SVG path/shape content
 * @param {string} description - Accessible name for the SVG
 * @returns {string} SVG element with title for accessibility
 */
function createAccessibleSVG(svgId, svgContent, description) {
  return `<svg id="${svgId}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-labelledby="${svgId}-title" role="img">
  <title id="${svgId}-title">${description}</title>
  ${svgContent}
</svg>`;
}

/**
 * REACT_036: Create proper accessible link instead of fake link
 * @param {string} href - Destination URL
 * @param {string} text - Link text
 * @param {string} additionalAttributes - Additional HTML attributes
 * @returns {string} Proper anchor element
 */
function createAccessibleLink(href, text, additionalAttributes = '') {
  return `<a href="${href}" ${additionalAttributes}>${text}</a>`;
}

/**
 * REACT_027: Generate table header cell with scope attribute
 * @param {string} text - Header text
 * @param {string} scope - Either 'col' or 'row'
 * @param {string} additionalAttributes - Additional HTML attributes
 * @returns {string} TH element with proper scope
 */
function createTableHeader(text, scope = 'col', additionalAttributes = '') {
  return `<th scope="${scope}" ${additionalAttributes}>${text}</th>`;
}

/**
 * Generate complete accessible page structure
 * @param {Object} options - Page options
 * @param {string} options.title - Page title
 * @param {string} options.logoText - Logo text
 * @param {string} options.navContent - Navigation HTML
 * @param {string} options.mainContent - Main content HTML
 * @param {string} options.footerContent - Footer HTML
 * @returns {string} Complete accessible HTML document
 */
function generateAccessiblePage(options) {
  const { title, logoText, navContent, mainContent, footerContent } = options;
  
  const header = createHeader(logoText, navContent);
  const main = createMain(mainContent);
  const footer = createFooter(footerContent);
  
  const bodyContent = `${header}
${main}
${footer}`;
  
  return createHTMLDocument(title, bodyContent);
}

// Export all functions for external use
module.exports = {
  createHTMLDocument,
  createHeader,
  createMain,
  createFooter,
  createAccessibleSVG,
  createAccessibleLink,
  createTableHeader,
  generateAccessiblePage
};