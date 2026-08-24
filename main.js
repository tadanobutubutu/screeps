// Import required modules
const landmarkData = require('./data/landmark-data.json');

// Existing code and functions

// TODO: Implement addProperLandmarkRegions();
function addProperLandmarkRegions() {
  // Loop through each landmark
  landmarkData.forEach((landmark) => {
    const { latitude, longitude, region } = landmark;

    // Assuming there's an existing object representing the region
    // where the landmark belongs. Update it with the new landmark.
    // You may need to refactor this part based on your actual data structure.
    if (regions[region]) {
      regions[region].landmarks.push(landmark);
    } else {
      // If the region does not exist, create a new region object with default properties.
      regions[region] = {
        name: region,
        landmarks: [landmark],
      };
    }
  });
}

// Other existing function calls
addAnimalSightingsToMap();
addLandmarkPositionsToMap();
addProperLandmarkRegions(); // Add our new function call

// Export the map object
module.exports = theMap;