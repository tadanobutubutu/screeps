// Landmark data
const landmarks = [
  { id: 1, name: "Eiffel Tower", latitude: 48.8584, longitude: 2.2945 },
  { id: 2, name: "Statue of Liberty", latitude: 40.6892, longitude: -74.0445 },
  { id: 3, name: "Great Wall of China", latitude: 40.4319, longitude: 116.5704 }
];

// TODO: Implement this function for checking landmark structure
function checkLandmarkStructure(landmark) {
  // Required properties for a valid landmark
  const requiredProperties = ['id', 'name', 'latitude', 'longitude'];
  
  // Check if landmark is an object
  if (!landmark || typeof landmark !== 'object') {
    return false;
  }
  
  // Check if all required properties exist
  for (const property of requiredProperties) {
    if (!(property in landmark)) {
      return false;
    }
  }
  
  // Validate coordinate values
  const lat = landmark.latitude;
  const lng = landmark.longitude;
  
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return false;
  }
  
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return false;
  }
  
  return true;
}

// Get all landmarks
function getLandmarks() {
  return landmarks;
}

// Add a landmark
function addLandmark(landmark) {
  if (!checkLandmarkStructure(landmark)) {
    throw new Error('Invalid landmark structure');
  }
  landmarks.push(landmark);
  return landmark;
}

// Export functions
module.exports = {
  getLandmarks,
  addLandmark,
  checkLandmarkStructure
};