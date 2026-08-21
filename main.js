// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_027: Fix 26 table structure issues
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

/**
 * Renders accessible SVG icons
 * @param {string} iconName - Name of the icon to render
 * @param {string} description - Accessible description for the SVG
 * @returns {string} HTML string with accessible SVG
 */
function renderIcon(iconName, description) {
  const icons = {
    search: '<svg viewBox="0 0 24 24" aria-label="' + description + '" role="img"><title>' + description + '</title><circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.35-4.35" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    settings: '<svg viewBox="0 0 24 24" aria-label="' + description + '" role="img"><title>' + description + '</title><circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2m-3.4-6.6l-1.4 1.4m-9.2 9.2l-1.4 1.4m0-12l1.4 1.4m9.2 9.2l1.4 1.4" fill="none" stroke="currentColor" stroke-width="2"/></svg>'
  };
  return icons[iconName] || '';
}

/**
 * Renders accessible table with proper structure
 * @param {Array} headers - Array of header strings
 * @param {Array} rows - 2D array of row data
 * @returns {string} Accessible HTML table
 */
function renderAccessibleTable(headers, rows) {
  let table = '<table>';
  
  // Add thead with scope="col" for proper accessibility
  table += '<thead><tr>';
  headers.forEach(function(header) {
    table += '<th scope="col">' + header + '</th>';
  });
  table += '</tr></thead>';
  
  // Add tbody with scope="row" for proper accessibility
  table += '<tbody>';
  rows.forEach(function(row) {
    table += '<tr>';
    row.forEach(function(cell, index) {
      // First cell in each row is a header cell
      if (index === 0) {
        table += '<th scope="row">' + cell + '</th>';
      } else {
        table += '<td>' + cell + '</td>';
      }
    });
    table += '</tr>';
  });
  table += '</tbody></table>';
  
  return table;
}

/**
 * Renders accessible navigation landmark
 * @param {string} label - Unique label for the navigation
 * @returns {string} Accessible navigation HTML
 */
function renderAccessibleNav(label) {
  return '<nav aria-label="' + label + '"></nav>';
}

/**
 * Renders accessible main landmark
 * @returns {string} Accessible main HTML
 */
function renderAccessibleMain() {
  return '<main></main>';
}

/**
 * Renders accessible header landmark
 * @param {string} label - Optional label for the header
 * @returns {string} Accessible header HTML
 */
function renderAccessibleHeader(label) {
  if (label) {
    return '<header role="banner" aria-label="' + label + '"></header>';
  }
  return '<header role="banner"></header>';
}

/**
 * Renders accessible footer landmark
 * @returns {string} Accessible footer HTML
 */
function renderAccessibleFooter() {
  return '<footer role="contentinfo"></footer>';
}

/**
 * Renders accessible button (not a fake link)
 * @param {string} text - Button text
 * @param {Function} onClick - Click handler
 * @returns {string} Accessible button HTML
 */
function renderAccessibleButton(text, onClick) {
  return '<button type="button" onclick="' + onClick + '">' + text + '</button>';
}

/**
 * Renders accessible link
 * @param {string} href - Valid href attribute
 * @param {string} text - Link text
 * @returns {string} Accessible link HTML
 */
function renderAccessibleLink(href, text) {
  if (!href || href === '#' || href === 'javascript:void(0)') {
    // Use button for non-navigating elements
    return '<button type="button">' + text + '</button>';
  }
  return '<a href="' + href + '">' + text + '</a>';
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderIcon,
    renderAccessibleTable,
    renderAccessibleNav,
    renderAccessibleMain,
    renderAccessibleHeader,
    renderAccessibleFooter,
    renderAccessibleButton,
    renderAccessibleLink
  };
}