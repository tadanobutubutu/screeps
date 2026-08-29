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

// Function for addressing accessibility issues from insight report
function addressAccessibilityIssues(insightReport) {
  // Handle case where insightReport is not provided or invalid
  if (!insightReport || typeof insightReport !== 'object') {
    return [];
  }
  
  const accessibilityIssues = insightReport.accessibilityIssues || [];
  
  if (!Array.isArray(accessibilityIssues)) {
    return [];
  }
  
  // Log each accessibility issue for review
  accessibilityIssues.forEach(issue => {
    if (issue && typeof issue === 'object') {
      const location = issue.location || 'unknown location';
      const description = issue.description || 'No description';
      const severity = issue.severity || 'unknown severity';
      const guidance = issue.guidance || 'No guidance available';
      
      console.log(`Accessibility Issue at ${location}:`);
      console.log(`  Description: ${description}`);
      console.log(`  Severity: ${severity}`);
      console.log(`  Guidance: ${guidance}`);
      console.log('---');
    }
  });
  
  return accessibilityIssues;
}

// Export functions for testing
module.exports = {
  calculateDistance,
  toRad,
  ensureUniqueLandmarks,
  addressAccessibilityIssues
};