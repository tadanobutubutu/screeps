// Complete updated main.js

// Main application file

// Function to calculate distance between two points
function calculateDistance(point1, point2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lon - point1.lon);
  const lat1 = toRad(point1.lat);
  const lat2 = toRad(point2.lat);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

// Function to add lang attribute to HTML element
function addLangAttribute(element, lang) {
  if (element && element.setAttribute) {
    element.setAttribute('lang', lang);
  }
}

// Function to fix table structure issues (placeholder)
function fixTableStructure(table) {
  // Example implementation: add proper header and row semantics
  if (!table || !table.tagName || table.tagName.toLowerCase() !== 'table') {
    return;
  }
  
  // Ensure table has a caption
  if (!table.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = 'Table caption';
    table.insertBefore(caption, table.firstChild);
  }
  
  // Ensure table has a thead
  let thead = table.querySelector('thead');
  if (!thead) {
    thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    // Add default header cells
    for (let i = 0; i < 3; i++) {
      const th = document.createElement('th');
      th.textContent = `Header ${i + 1}`;
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.insertBefore(thead, table.querySelector('caption') ? table.children[1] : table.firstChild);
  }
  
  // Ensure all rows have proper td/th structure
  const rows = table.querySelectorAll('tr');
  rows.forEach(row => {
    const cells = row.querySelectorAll('th, td');
    cells.forEach((cell, index) => {
      if (!cell.hasAttribute('scope')) {
        if (row.closest('thead')) {
          cell.setAttribute('scope', 'col');
        } else if (row.closest('tbody')) {
          cell.setAttribute('scope', 'row');
        }
      }
    });
  });
}

// Function to add main landmark
function addMainLandmark(element) {
  if (element && element.setAttribute) {
    element.setAttribute('role', 'main');
  }
}

// Ensure unique landmarks
function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (!landmark) return false;
    
    const identifier = landmark.id || landmark.name || JSON.stringify(landmark);
    
    if (seen.has(identifier)) {
      return false;
    }
    seen.add(identifier);
    return true;
  });
}

// Function to add accessible names to SVG elements
function addSvgAccessibleNames(svgElement, accessibleName) {
  if (svgElement && svgElement.setAttribute) {
    svgElement.setAttribute('aria-label', accessibleName);
    svgElement.setAttribute('role', 'img');
  }
}

// Function to fix fake link issue
function fixFakeLinkIssue(linkElement) {
  if (!linkElement || !linkElement.tagName || linkElement.tagName.toLowerCase() !== 'a') {
    return;
  }
  
  const href = linkElement.getAttribute('href');
  const textContent = linkElement.textContent?.trim();
  
  // If link appears to be a fake (no href or empty text), make it real
  if (!href || !textContent) {
    linkElement.setAttribute('href', '#');
    linkElement.setAttribute('aria-label', textContent || 'Link');
    linkElement.setAttribute('role', 'button');
  }
}

// Export functions for testing
module.exports = {
  calculateDistance,
  toRad,
  ensureUniqueLandmarks,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinkIssue
};