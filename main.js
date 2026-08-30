function addProperLandmarkRegions(landmarks) {
  if (!Array.isArray(landmarks)) {
    throw new TypeError('Expected an array of landmarks');
  }

  return landmarks.map((landmark, index) => {
    const region = calculateRegion(landmark);
    return {
      ...landmark,
      region,
      id: landmark.id || index,
    };
  });
}

function calculateRegion(landmark) {
  if (landmark.latitude !== undefined && landmark.longitude !== undefined) {
    return `${landmark.latitude},${landmark.longitude}`;
  }
  return 'unknown';
}

module.exports = {
  addProperLandmarkRegions,
};