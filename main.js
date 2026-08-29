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

// Render dependency graph as a visual structure for debugging
function renderDependencyGraph(modules, options = {}) {
  const indent = options.indent || '  ';
  const visited = new Set();
  const result = [];
  
  function traverse(module, depth = 0) {
    const prefix = indent.repeat(depth);
    if (visited.has(module)) {
      result.push(`${prefix}└── ${module} (circular)`);
      return;
    }
    visited.add(module);
    
    result.push(`${prefix}└── ${module}`);
    
    if (options.showDependencies && modules[module]) {
      const deps = modules[module].dependencies || [];
      deps.forEach(dep => {
        traverse(dep, depth + 1);
      });
    }
  }
  
  Object.keys(modules).forEach(module => {
    if (!visited.has(module)) {
      traverse(module);
    }
  });
  
  return result.join('\n');
}

// Display module structure for debugging purposes
function displayModuleStructure(modules, options = {}) {
  const output = [];
  const format = options.format || 'table';
  
  if (format === 'table') {
    output.push('Module Structure:');
    output.push('================');
    Object.entries(modules).forEach(([name, info]) => {
      const deps = info.dependencies ? info.dependencies.join(', ') : 'none';
      output.push(`${name.padEnd(20)} | Dependencies: ${deps}`);
    });
  } else if (format === 'json') {
    output.push(JSON.stringify(modules, null, 2));
  }
  
  return output.join('\n');
}

// Export functions for testing
module.exports = {
  calculateDistance,
  toRad,
  ensureUniqueLandmarks,
  renderDependencyGraph,
  displayModuleStructure
};