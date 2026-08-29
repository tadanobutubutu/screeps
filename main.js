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

// TODO: Implement this function for ensuring unique landmarks
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

// New accessibility-related functions
function getLangAttribute(element) {
  if (element && element.lang) return element.lang;
  return 'en';
}

function personName(person) {
  if (person && person.name) return person.name;
  return '';
}

function validateTableAccessibility(table) {
  if (!table || !table.rows) return true;
  const firstRow = table.querySelector('tr');
  if (firstRow && firstRow.querySelectorAll('th')) return true;
  return false;
}

function validateTableStructure(table) {
  // Basic structural validation – ensure table has at least one row with header cells
  if (!table) return true;
  const rows = Array.from(table.querySelectorAll('tr'));
  if (rows.length === 0) return false;
  const firstRow = rows[0];
  return firstRow.querySelectorAll('th').length > 0;
}

function validateLandmark(landmark) {
  if (!landmark) return false;
  const id = landmark.id || landmark.name;
  return !!id;
}

function validateLandmarkStructure(landmarks) {
  const seen = new Set();
  for (const lm of landmarks) {
    if (!lm) continue;
    const id = lm.id || lm.name;
    if (seen.has(id)) return false;
    seen.add(id);
  }
  return true;
}

function getSvgAccessibleName(svgElement) {
  if (svgElement && svgElement.title) return svgElement.title;
  if (svgElement && svgElement.ariaLabel) return svgElement.ariaLabel;
  return '';
}

function createInPageButton() {
  const btn = document.createElement('button');
  btn.textContent = 'Click me';
  btn.className = 'accessible-button';
  document.body.appendChild(btn);
  return btn;
}

// Export functions for testing
module.exports = {
  calculateDistance,
  toRad,
  ensureUniqueLandmarks,
  getLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton
};