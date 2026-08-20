// TODO: Address accessibility issues from insight report:
// ... (rest of your existing code remains unchanged)
// ADD BELOW FOR THE MISSING EXPORTS

function renderAccessibleHTML(html) {
  const wrap = `
    <html lang="en">
      ${renderAccessibleHeader()}
      ${renderMain()}
      ${renderFooter()}
  `;
  return wrap.replace('<main>', `<main>${html}`).replace(new RegExp('<body', 'g'), '<body class="main-content"');
}

function renderAccessibleModal(modalID, modalContent) {
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

  return modal.replace('<h5 class="modal-title">Modal title</h5>', `<h5 class="modal-title" id="${modalID}-title">Modal title</h5>`).replace('<footer>', `<footer role="contentinfo">`);
}

function renderIcon(iconName, description) {
  const icons = {
    search: `<svg viewBox="0 0 24 24" aria-label="${description}" role="img"><circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.35-4.35" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
    settings: `<svg viewBox="0 0 24 24" aria-label="${description}" role="img"><circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2m-3.4-6.6l-1.4 1.4m-9.2 9.2l-1.4 1.4m0-12l1.4 1.4m9.2 9.2l1.4 1.4" fill="none" stroke="currentColor" stroke-width="2"/></svg>`
  };
  return icons[iconName] || '';
}

function renderAccessibleIcon(iconName, attributes = {}, isDecorative = false, accessibleLabel = '') {
  const { viewBox = "0 0 100 100", width = 32, height = 32, className = '' } = attributes;
  
  let ariaAttributes = '';
  
  if (isDecorative) {
    ariaAttributes = 'aria-hidden="true"';
  } else {
    ariaAttributes = `aria-label="${accessibleLabel || iconName}" role="img"`;
  }
  
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

/**
 * Renders an accessible table with proper structure
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