const fs = require('fs');
const path = require('path');

// Landmark data storage
let landmarks = [];

// Load landmarks from file
function loadLandmarks() {
  try {
    const dataPath = path.join(__dirname, 'data', 'landmarks.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    landmarks = JSON.parse(data);
    return landmarks;
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
}

// Save landmarks to file
function saveLandmarks() {
  try {
    const dataPath = path.join(__dirname, 'data', 'landmarks.json');
    fs.writeFileSync(dataPath, JSON.stringify(landmarks, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving landmarks:', error.message);
    return false;
  }
}

// Unique landmarks handler
function handleUniqueLandmarks(landmarkList) {
  if (!Array.isArray(landmarkList)) {
    console.error('Invalid input: expected an array of landmarks');
    return [];
  }

  const seen = new Set();
  const uniqueLandmarks = [];

  for (const landmark of landmarkList) {
    const identifier = landmark.id || landmark.name || JSON.stringify(landmark);
    
    if (!seen.has(identifier)) {
      seen.add(identifier);
      uniqueLandmarks.push(landmark);
    }
  }

  return uniqueLandmarks;
}

// Get unique landmarks
function getUniqueLandmarks() {
  return handleUniqueLandmarks(landmarks);
}

// Add a new landmark
function addLandmark(landmark) {
  if (!landmark || typeof landmark !== 'object') {
    return null;
  }

  const uniqueLandmarks = handleUniqueLandmarks([...landmarks, landmark]);
  landmarks = uniqueLandmarks;
  saveLandmarks();
  
  return landmark;
}

// Remove duplicate landmarks
function removeDuplicateLandmarks() {
  const previousCount = landmarks.length;
  landmarks = handleUniqueLandmarks(landmarks);
  const newCount = landmarks.length;
  
  saveLandmarks();
  
  return {
    previousCount,
    newCount,
    duplicatesRemoved: previousCount - newCount
  };
}

// Export functions for testing and external use
module.exports = {
  loadLandmarks,
  saveLandmarks,
  handleUniqueLandmarks,
  getUniqueLandmarks,
  addLandmark,
  removeDuplicateLandmarks
};

// Main execution
if (require.main === module) {
  loadLandmarks();
  console.log(`Loaded ${landmarks.length} landmarks`);
  
  const uniqueCount = handleUniqueLandmarks(landmarks).length;
  console.log(`Found ${uniqueCount} unique landmarks`);
}