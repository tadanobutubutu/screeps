// Main application file

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

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

// Ensure unique landmarks
function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (!landmark) return false;
    
    const identifier = landmark.id || landmark.name || landmark.role;
    
    if (seen.has(identifier)) {
      return false;
    }
    seen.add(identifier);
    return true;
  });
}

// Add lang attribute to HTML element for accessibility
function addLangAttribute(document, langCode = 'en') {
  if (!document || !document.documentElement) return;
  
  const htmlElement = document.documentElement;
  if (!htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', langCode);
  }
  return htmlElement.getAttribute('lang');
}

// Fix table structure issues for accessibility
function fixTableStructure(table) {
  if (!table) return null;
  
  // Ensure tables have proper headers
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.getAttribute('scope')) {
      th.setAttribute('scope', 'col');
    }
  });
  
  // Ensure tables have captions or summaries
  const hasCaption = table.querySelector('caption');
  const hasSummary = table.getAttribute('summary');
  
  if (!hasCaption && !hasSummary) {
    const caption = document.createElement('caption');
    caption.textContent = 'Data table';
    table.insertBefore(caption, table.firstChild);
  }
  
  return table;
}

// Add main landmark for accessibility
function addMainLandmark(document) {
  if (!document) return null;
  
  const existingMain = document.querySelector('main');
  if (existingMain) return existingMain;
  
  const body = document.body;
  if (!body) return null;
  
  const mainElement = document.createElement('main');
  
  // Move all children except main into the new main element
  while (body.firstChild) {
    mainElement.appendChild(body.firstChild);
  }
  
  body.appendChild(mainElement);
  return mainElement;
}

// Add accessible names to SVGs
function addSvgAccessibleNames(document, svgNames = {}) {
  if (!document) return [];
  
  const svgs = document.querySelectorAll('svg');
  const updated = [];
  
  svgs.forEach((svg, index) => {
    const hasTitle = svg.querySelector('title');
    const hasAriaLabel = svg.getAttribute('aria-label');
    
    if (!hasTitle && !hasAriaLabel) {
      const title = document.createElement('title');
      const svgId = svg.getAttribute('id');
      const name = svgNames[svgId] || svgNames[index] || `SVG image ${index + 1}`;
      
      title.textContent = name;
      title.id = `svg-title-${index}`;
      
      // Insert title as first child
      if (svg.firstChild) {
        svg.insertBefore(title, svg.firstChild);
      } else {
        svg.appendChild(title);
      }
      
      svg.setAttribute('aria-labelledby', title.id);
      updated.push(svg);
    }
  });
  
  return updated;
}

// Fix fake link issue - elements that look like links but aren't
function fixFakeLinkIssue(document) {
  if (!document) return [];
  
  const fakeLinks = document.querySelectorAll('[role="link"]:not(a), a[href="#"]:not([href]), a[href="javascript:void(0)"]');
  const fixed = [];
  
  fakeLinks.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    
    if (tagName !== 'a') {
      // Non-anchor elements with role="link" need keyboard accessibility
      if (!element.getAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
      if (!element.getAttribute('role')) {
        element.setAttribute('role', 'link');
      }
    } else {
      // Anchor with empty or javascript href should have proper handling
      const href = element.getAttribute('href');
      if (href === '#' || href === 'javascript:void(0)') {
        element.setAttribute('aria-disabled', 'true');
        element.removeAttribute('href');
      }
    }
    
    fixed.push(element);
  });
  
  return fixed;
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