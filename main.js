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

// Function to ensure the element has an id
function ensureElementHasId(element) {
  if (!element) {
    return null;
  }
  
  if (element.id) {
    return element;
  }
  
  const generatedId = `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  element.id = generatedId;
  return element;
}

// Function to add aria-label to an element
function addAriaLabel(element, label) {
  if (!element) {
    return null;
  }
  
  if (typeof label !== 'string' || label.trim() === '') {
    return element;
  }
  
  element.setAttribute('aria-label', label);
  return element;
}

// Function to render dependency graphs
function renderDependencyGraph(dependencies) {
  if (!Array.isArray(dependencies)) {
    return null;
  }
  
  const graph = {
    nodes: [],
    edges: []
  };
  
  const nodeMap = new Map();
  
  dependencies.forEach((dep, index) => {
    if (!dep) return;
    
    const nodeId = dep.id || `node_${index}`;
    
    if (!nodeMap.has(nodeId)) {
      nodeMap.set(nodeId, true);
      graph.nodes.push({
        id: nodeId,
        name: dep.name || nodeId,
        type: dep.type || 'dependency'
      });
    }
    
    if (dep.dependencies && Array.isArray(dep.dependencies)) {
      dep.dependencies.forEach(childDep => {
        const childId = childDep.id || `node_${Math.random().toString(36).substr(2, 9)}`;
        
        if (!nodeMap.has(childId)) {
          nodeMap.set(childId, true);
          graph.nodes.push({
            id: childId,
            name: childDep.name || childId,
            type: childDep.type || 'dependency'
          });
        }
        
        graph.edges.push({
          from: nodeId,
          to: childId
        });
      });
    }
  });
  
  return graph;
}

// Export functions for testing
module.exports = {
  calculateDistance,
  toRad,
  ensureUniqueLandmarks,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph
};