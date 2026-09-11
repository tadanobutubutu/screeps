// TODO: Implement function for adding proper landmark regions

function validateLandmark(landmark) {
  if (!landmark) return false;
  if (!landmark.name || typeof landmark.name !== 'string') return false;
  if (typeof landmark.lat !== 'number' || typeof landmark.lng !== 'number') return false;
  if (landmark.lat < -90 || landmark.lat > 90) return false;
  if (landmark.lng < -180 || landmark.lng > 180) return false;
  return true;
}

function addLandmarkRegion(landmarks, landmarkName, lat, lng) {
  const landmark = { name: landmarkName, lat: lat, lng: lng };
  if (validateLandmark(landmark)) {
    landmarks.push(landmark);
  } else {
    throw new Error('Invalid landmark data provided');
  }
}

module.exports = { validateLandmark, addLandmarkRegion };