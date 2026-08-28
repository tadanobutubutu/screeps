// ... Existing code from main.js ...

// Function to validate landmark structure
function validateLandmarkStructure(landmark) {
  const landmarkRole = landmark.getAttribute('role');
  if (!landmarkRole || landmarkRole !== 'landmark') {
    console.error(`Invalid role for landmark: ${landmark.id}. Should be "landmark"`);
    return false;
  }

  const landmarkLabelledBy = landmark.getAttribute('aria-labelledby');
  if (!landmarkLabelledBy) {
    console.error(`Missing aria-labelledby attribute for landmark: ${landmark.id}`);
    return false;
  }

  const labelledByElements = document.querySelectorAll(`[id=${landmarkLabelledBy}]`);
  if (labelledByElements.length === 0) {
    console.error(`No element with id "${landmarkLabelledBy}" found for landmark: ${landmark.id}`);
    return false;
  }

  // Check if at least one labelledBy element is a visible text
  let hasVisibleText = false;
  labelledByElements.forEach((element) => {
    if (element.nodeName === 'SPAN' && element.textContent.trim().length > 0) {
      hasVisibleText = true;
    }
    if (element.nodeName === '#text' && element.textContent.trim().length > 0) {
      hasVisibleText = true;
    }
  });

  if (!hasVisibleText) {
    console.error(`No visible text found for the labelledBy elements of landmark: ${landmark.id}`);
    return false;
  }

  return true;
}

// Function to validate landmark attributes
function validateLandmarkAttributes(landmark) {
  const landmarkId = landmark.id;

  // Check if the landmark has a unique id
  if (document.querySelectorAll(`[id="${landmarkId}"]`).length > 1) {
    console.error(`Landmark with id "${landmarkId}" is not unique!`);
    return false;
  }

  // Check if the landmark has at least one child
  if (landmark.childNodes.length === 0) {
    console.error(`Landmark with id "${landmarkId}" has no children.`);
    return false;
  }

  // Call validateLandmarkStructure() function
  const validationResult = validateLandmarkStructure(landmark);
  if (!validationResult) {
    return false;
  }

  // Check if there is a heading in the landmark
  const headingsInLandmark = landmark.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (headingsInLandmark.length === 0) {
    console.error(`Landmark with id "${landmarkId}" should have at least one heading (h1-h6).`);
    return false;
  }

  return true;
}

// Add validation functions to the existing landmark checks in main.js
const landmarks = document.querySelectorAll('.landmark');
landmarks.forEach((landmark, index) => {
  // ... Existing code ...

  // Validate landmark structure and attributes
  if (!validateLandmarkAttributes(landmark)) {
    console.error(`Landmark validation issues for landmark with id '${landmark.id}'`);
  }
});

// ... Existing code below the landmarks loop ...