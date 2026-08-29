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

// Ensure unique landmarks by filtering duplicates
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

// Export functions for testing
module.exports = {
  calculateDistance,
  toRad,
  ensureUniqueLandmarks,
  renderGraphIndex
};