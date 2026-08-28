const map = new Map();
const landmarkManager = new LandmarkManager(map);

class LandmarkManager {
  constructor(map) {
    this.map = map;
  }

  addLandmark(x, y, name) {
    // Logic to add a single landmark
    this.map.set(`${x},${y}`, { name, x, y });
  }

  addProperLandmarkRegions(regions) {
    // Assuming regions is an array of objects with x, y, and name properties
    regions.forEach(region => {
      this.addLandmark(region.x, region.y, region.name);
    });
  }
}

// Call this function with an array of regions to add landmarks
landmarkManager.addProperLandmarkRegions([
  { x: 1, y: 2, name: 'Landmark1' },
  { x: 3, y: 4, name: 'Landmark2' },
  // ... more regions
]);

// Export the LandmarkManager if needed
module.exports = { LandmarkManager };