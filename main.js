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

// Sets an aria attribute on an element, with validation
function setAriaAttribute(element, attribute, value) {
  if (!element || !attribute) {
    return;
  }
  // Ensure the attribute name is prefixed with 'aria-'
  const attrName = attribute.startsWith('aria-') ? attribute : `aria-${attribute}`;
  element.setAttribute(attrName, String(value));
}

// Removes an aria attribute from an element
function removeAriaAttribute(element, attribute) {
  if (!element || !attribute) {
    return;
  }
  const attrName = attribute.startsWith('aria-') ? attribute : `aria-${attribute}`;
  element.removeAttribute(attrName);
}

// Sets multiple aria attributes on an element from an object
function setAriaAttributes(element, attributes) {
  if (!element || !attributes || typeof attributes !== 'object') {
    return;
  }
  for (const [key, value] of Object.entries(attributes)) {
    setAriaAttribute(element, key, value);
  }
}

// Makes an element focusable by adding tabindex and aria attributes
function makeAccessible(element, options = {}) {
  if (!element) {
    return;
  }
  if (options.focusable) {
    element.setAttribute('tabindex', options.tabindex || '0');
  }
  if (options.label) {
    element.setAttribute('aria-label', options.label);
  }
  if (options.labelledBy) {
    element.setAttribute('aria-labelledby', options.labelledBy);
  }
  if (options.describedBy) {
    element.setAttribute('aria-describedby', options.describedBy);
  }
  if (options.role) {
    element.setAttribute('role', options.role);
  }
  if (options.hidden !== undefined) {
    element.setAttribute('aria-hidden', String(options.hidden));
  }
}

// Export functions for testing
module.exports = {
  calculateDistance,
  toRad,
  ensureUniqueLandmarks,
  setAriaAttribute,
  removeAriaAttribute,
  setAriaAttributes,
  makeAccessible
};