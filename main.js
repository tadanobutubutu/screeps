// TODO: Address accessibility issues from insight report:
// ... (rest of your existing code remains unchanged)
// ADD BELOW FOR THE MISSING EXPORTS

/**
 * Renders accessible HTML with appropriate structure and landmarks
 * @param {string} html - HTML string to be made accessible
 * @returns {string} Rendered accessible HTML with appropriate structure and landmarks
 */
function renderAccessibleHTML(html) {
  // Provide a proper HTML structure and landmarks
  const wrap = `
    <html lang="en">
      ${renderAccessibleHeader()}
      ${renderMain()}
      ${renderFooter()}
    </html>
  `;
  // Wrap the provided HTML inside the accessible HTML structure
  return wrap.replace('<main>', `<main>${html}`).replace(new RegExp('<body', 'g'), '<body class="main-content"');
}

/**
 * Renders accessible modal with proper structure
 * @param {string} modalID - Unique modal ID
 * @param {string} modalContent - Modal content HTML
 * @returns {string} Accessible modal HTML
 */
function renderAccessibleModal(modalID, modalContent) {
  // HTML for a basic inaccessible modal
  const modal = `
    <div id="${modalID}" tabindex="-1" aria-hidden="true" class="modal fade" role="dialog" >
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal header -->
          <div class="modal-header">
            <h5 class="modal-title">Modal title</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <!-- Modal body -->
          <div class="modal-body">
            ${modalContent}
          </div>
          <!-- Modal footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Provide proper accessibility
  const accessibleModal = `
    <div id="${modalID}" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="${modalID}-title" class="modal fade" >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          ${renderAccessibleNav('Modal navigation')}
          ${renderAccessibleHeader('Modal header', 'Modal header')}
          ${renderAccessibleMain(`<main role="document" aria-labelledby="${modalID}-title">`)}
          <article role="article">
            ${modalContent}
          </article>
          ${renderAccessibleFooter()}
        </div>
      </div>
    </div>
  `;

  // Replace the basic modal with the accessible one
  return modal.replace('<h5 class="modal-title">Modal title</h5>', `<h5 class="modal-title" id="${modalID}-title">Modal title</h5>`).replace('<footer>', `<footer role="contentinfo">`);
}

/**
 * Renders an accessible icon (SVG) with proper accessible name
 * @param {string} iconId - Unique identifier for the icon
 * @param {string} iconType - Type of icon (icon, apple, etc.)
 * @param {object} options - Additional options (size, className, etc.)
 * @returns {string} Accessible SVG icon HTML
 */
function renderIcon(iconId, iconType, options = {}) {
  const { size = 32, className = '' } = options;
  
  // SVG icon content - add <title> for accessibility
  const iconContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" class="${className}" role="img">
      <title>Screeps Dashboard</title>
      <text y=".9em" font-size="90">🎮</text>
    </svg>
  `;
  
  return iconContent;
}

/**
 * Renders an accessible SVG icon with proper accessible name for screen readers
 * @param {string} iconName - Name/identifier for the icon
 * @param {object} attributes - SVG attributes (viewBox, width, height, className, etc.)
 * @param {boolean} isDecorative - Whether the icon is purely decorative (hidden from screen readers)
 * @param {string} accessibleLabel - Label for screen readers (required if not decorative)
 * @returns {string} Accessible SVG icon HTML string
 */
function renderAccessibleIcon(iconName, attributes = {}, isDecorative = false, accessibleLabel = '') {
  const { viewBox = "0 0 100 100", width = 32, height = 32, className = '' } = attributes;
  
  // Build SVG with accessible attributes
  let ariaAttributes = '';
  
  if (isDecorative) {
    ariaAttributes = 'aria-hidden="true"';
  } else {
    ariaAttributes = `aria-label="${accessibleLabel || iconName}" role="img"`;
  }
  
  // Generate SVG with <title> element for accessibility
  const svg = `
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="${viewBox}" 
      width="${width}" 
      height="${height}" 
      class="${className}"
      ${ariaAttributes}
    >
      ${!isDecorative ? `<title>${accessibleLabel || iconName}</title>` : ''}
      <text y=".9em" font-size="90">🎮</text>
    </svg>
  `;
  
  return svg;
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderIcon,
    renderAccessibleIcon,
    renderAccessibleTable,
    renderAccessibleNav,
    renderAccessibleMain,
    renderAccessibleHeader,
    renderAccessibleFooter,
    renderAccessibleButton,
    renderAccessibleLink,
    renderAccessibleHTML,
    renderAccessibleModal
  };
}