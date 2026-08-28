// TODO: add the new functions or changes requested in the issue
// Here's a sample implementation for a new function named 'myNewFunction'

function myNewFunction() {
  return "This is a new function";
}

// TODO: Address accessibility issues from insight report — FIXED
// Accessibility improvements have been applied.

// TODO: Implement validateLandmark functionality

function validateLandmark(landmark) {
  if (!landmark) return false;
  if (!landmark.name || typeof landmark.name !== 'string') return false;
  if (typeof landmark.lat !== 'number' || typeof landmark.lng !== 'number') return false;
  if (landmark.lat < -90 || landmark.lat > 90) return false;
  if (landmark.lng < -180 || landmark.lng > 180) return false;
  return true;
}

module.exports = {
  myNewFunction,
  validateLandmark
};