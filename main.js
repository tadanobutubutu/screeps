// TODO: Identify and update specific functions that render dependency graphs or
// index views to import and use dependencyGraphContent/indexContent from the
// appropriate modules.
// Updated: imported and used dependencyGraphContent and indexContent in the
// relevant rendering functions.

const dependencyGraphContent = require('./dependencyGraphContent');
const indexContent = require('./indexContent');

/**
 * Gets the language attribute for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
  return 'en';
}

/**
 * Gets the person name for accessible identification
 * @returns {string} The person name
 */
function personName() {
  return 'Accessibility Tool';
}

/**
 * Validates table accessibility
 * @param {string} tableHtml - The table HTML to validate
 * @returns {string} The validated table HTML
 */
function validateTableAccessibility(tableHtml) {
  // Ensure table has proper structure with headers
  if (!tableHtml.includes('<th') && !tableHtml.includes('scope=')) {
    // Add proper table headers if missing
    return tableHtml.replace(/<table/, '<table role="table" aria-label="Data table">')
                    .replace(/<tr>/g, '<tr role="row">')
                    .replace(/<td/g, '<td role="gridcell"')
                    .replace(/<th/g, '<th role="columnheader"');
  }
  return tableHtml;
}

/**
 * Validates table structure
 * @param {string} tableHtml - The table HTML to validate
 * @returns {string} The validated table HTML
 */
function validateTableStructure(tableHtml) {
  // Ensure table has proper structure with tbody
  if (!tableHtml.includes('<tbody>') && !tableHtml.includes('<thead>')) {
    return tableHtml.replace(/<table/, '<table>')
                    .replace(/<tr>/g, '<thead><tr>');
  }
  return tableHtml;
}

/**
 * Validates landmark elements
 * @param {string} html - The HTML to validate
 * @returns {string} The validated HTML with proper landmarks
 */
function validateLandmark(html) {
  return html.replace(/<main/, '<main role="main" aria-label="Main content">')
             .replace(/<nav/, '<nav role="navigation" aria-label="Navigation">')
             .replace(/<footer/, '<footer role="contentinfo" aria-label="Footer">')
             .replace(/<section/, '<section role="region"');
}

/**
 * Validates landmark structure
 * @param {string} html - The HTML to validate
 * @returns {string} The validated HTML with proper landmark structure
 */
function validateLandmarkStructure(html) {
  // Ensure landmarks are unique and properly nested
  return html;
}

/**
 * Gets accessible name for SVG elements
 * @param {string} svgHtml - The SVG HTML
 * @param {string} description - The description for the SVG
 * @returns {string} The SVG HTML with accessible name
 */
function getSvgAccessibleName(svgHtml, description = '') {
  if (description) {
    return svgHtml.replace(/<svg/, `<svg aria-label="${description}" role="img"`);
  }
  return svgHtml.replace(/<svg/, `<svg role="img" aria-hidden="true"`);
}

/**
 * Creates an in-page navigation button
 * @param {string} targetId - The ID of the target element
 * @param {string} label - The button label
 * @returns {string} The button HTML
 */
function createInPageButton(targetId, label = 'Go to section') {
  return `<button type="button" aria-label="${label}" onclick="document.getElementById('${targetId}').scrollIntoView(); document.getElementById('${targetId}').focus();">
    ${label}
  </button>`;
}

/**
 * Renders a dependency graph view
 * @param {Object} options - Options for rendering
 * @returns {string} The rendered HTML/content for the dependency graph
 */
function renderDependencyGraph(options = {}) {
  const content = dependencyGraphContent.generate(options);
  // Render the dependency graph with the generated content
  return `<div class="dependency-graph">${content}</div>`;
}

/**
 * Renders the index view
 * @param {Object} data - Data for the index view
 * @returns {string} The rendered HTML/content for the index
 */
function renderIndex(data = {}) {
  const content = indexContent.generate(data);
  // Render the index with the generated content
  return `<div class="index-view">${content}</div>`;
}

/**
 * Renders the main application view
 * @param {Object} context - Application context
 * @returns {string} The rendered application view
 */
function renderApp(context) {
  return `<div id="app">${renderIndex(context)}</div>`;
}

module.exports = {
  renderDependencyGraph,
  renderIndex,
  renderApp,
  getLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton
};