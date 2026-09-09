// Accessibility-focused JavaScript module

// TODO: Address accessibility issues from insight report:

/**
 * Initialize accessibility features for the application
 */
function initializeAccessibility() {
    // Set up keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Set up focus management
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    
    // Set up click handler for accessibility
    document.addEventListener('click', handleClickAccessibility);
    
    // Initialize ARIA live regions
    initializeAriaLiveRegions();
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

// Ensure unique landmarks by filtering duplicates
function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (!landmark) return false;
    
    // Support space and enter for button-like elements
    if ((event.key === ' ' || event.key === 'Enter') && 
        (target.tagName === 'BUTTON' || target.getAttribute('role') === 'button')) {
        event.preventDefault();
        target.click();
    }
    
    // Escape key handling for modals/dialogs
    if (event.key === 'Escape' && target.getAttribute('aria-expanded') === 'true') {
        target.setAttribute('aria-expanded', 'false');
    }
    
    // Arrow key navigation for menu items
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        handleArrowKeyNavigation(event, target);
    }
}

// Render index data for graph display
function renderGraphIndex(landmarks, connections) {
  const uniqueLandmarks = ensureUniqueLandmarks(landmarks);
  
  const nodes = uniqueLandmarks.map(landmark => ({
    id: landmark.id || landmark.name,
    label: landmark.name || landmark.id,
    lat: landmark.lat,
    lon: landmark.lon
  }));
  
  const edges = connections.map(conn => ({
    source: conn.from,
    target: conn.to,
    weight: calculateDistance(
      { lat: conn.fromLat, lon: conn.fromLon },
      { lat: conn.toLat, lon: conn.toLon }
    )
  }));
  
  return {
    nodes,
    edges,
    metadata: {
      totalNodes: nodes.length,
      totalEdges: edges.length
    }
  };
}

// Ensure the dependencyGraph container has a proper ARIA role
function ensureDependencyGraphAriaRole() {
  const container = document.getElementById('dependencyGraph') ||
                    document.querySelector('[data-testid="dependency-graph"]') ||
                    document.querySelector('.dependency-graph');
  if (container) {
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Dependency Graph');
  }
}

// Run the ARIA role fix after the DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', ensureDependencyGraphAriaRole);
}

// Export functions for testing
module.exports = {
  calculateDistance,
  toRad,
  ensureUniqueLandmarks,
  renderGraphIndex
};