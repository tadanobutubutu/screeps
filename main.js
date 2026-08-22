// main.js - Accessibility-improved version
// Addresses: REACT_015, REACT_025, REACT_027, REACT_041, REACT_017, REACT_036

// Sample data for tables (your actual data should replace this)
const sampleData = [
  { id: 1, name: 'Item 1', status: 'Active' },
  { id: 2, name: 'Item 2', status: 'Inactive' },
];

// Function to create accessible tables
function createAccessibleTable(data, tableId) {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  
  let html = `<table id="${tableId}" aria-label="${tableId} Table">`;
  html += '<caption>Data overview</caption>';
  html += '<thead><tr>';
  
  // REACT_015: Language attribute handled at HTML level, but here we ensure proper scope
  headers.forEach(header => {
    html += `<th scope="col">${header.charAt(0).toUpperCase() + header.slice(1)}</th>`;
  });
  
  html += '</tr></thead><tbody>';
  
  data.forEach((row, index) => {
    html += '<tr>';
    headers.forEach((header, i) => {
      // First column gets row scope for accessibility
      const scope = i === 0 ? 'row' : 'col';
      html += `<td${i === 0 ? ' scope="row"' : ''}>${row[header]}</td>`;
    });
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  return html;
}

// Function to create accessible SVG icons (REACT_041)
function createAccessibleSVG(svgContent, ariaLabel, description) {
  return `<svg xmlns="http://www.w3.org/2000/svg" aria-label="${ariaLabel}" role="img">
  <title>${ariaLabel}</title>
  <desc>${description}</desc>
  ${svgContent}
</svg>`;
}

// Function to create accessible landmark sections (REACT_025, REACT_017)
function createLandmarkSection(content, sectionType, label) {
  const validLandmarks = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article'];
  const element = validLandmarks.includes(sectionType) ? sectionType : 'section';
  const ariaLabel = label ? `aria-label="${label}"` : '';
  return `<${element} ${ariaLabel}>${content}</${element}>`;
}

// Function to create accessible links instead of fake links (REACT_036)
function createAccessibleLink(href, text, onClick) {
  // Real links use <a> tags with href
  return `<a href="${href}" class="accessible-link">${text}</a>`;
}

// Function to render the page with accessibility improvements
function renderPage() {
  // REACT_017: Ensure unique landmarks
  let output = '<main aria-label="Main Content">';
  
  // REACT_025: Unique landmark for navigation
  output += '<nav aria-label="Primary Navigation">';
  output += '<ul>';
  output += '<li><a href="/">Home</a></li>';
  output += '<li><a href="/about">About</a></li>';
  output += '</ul>';
  output += '</nav>';
  
  // Create accessible table (REACT_027)
  output += createAccessibleTable(sampleData, 'data-table');
  
  // Create accessible SVG example (REACT_041)
  const iconSVG = '<circle cx="12" cy="12" r="10"/>';
  output += createAccessibleSVG(iconSVG, 'Decorative icon', 'A circular decorative icon');
  
  output += '</main>';
  
  return output;
}

// Export functions for use elsewhere
module.exports = {
  createAccessibleTable,
  createAccessibleSVG,
  createLandmarkSection,
  createAccessibleLink,
  renderPage,
  sampleData,
};

// Default export
module.exports.default = renderPage;