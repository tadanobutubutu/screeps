// TODO: Implement validateLandmark functionality

function validateLandmark(landmark) {
  if (!landmark || typeof landmark !== 'object') {
    return false;
  }
  
  if (!landmark.id) {
    return false;
  }
  
  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    return false;
  }
  
  return true;
}

module.exports = {
  validateLandmark
};