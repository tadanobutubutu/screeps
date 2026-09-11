/**
 * Checks landmark elements on the page for accessibility
 * @returns {Object} An object containing landmark analysis results
 */
function checkLandmarkElements() {
  // ... (existing code)

  // FADE IN - Add new function to check for a specific class
  function checkSpecificClass(className) {
    const elementsWithClass = document.getElementsByClassName(className);

    const result = {
      // Set the appropriate property values
      elementFound: elementsWithClass.length > 0,
      totalElements: elementsWithClass.length
    };

    return result;
  }

  // Usage example:
  const specificClassResult = checkSpecificClass('my-custom-class');

  if (specificClassResult.elementFound) {
    // Do something if the element with the given class is found
    console.log("Element with class 'my-custom-class' found.", specificClassResult);
  } else {
    result.warnings.push("Element with class 'my-custom-class' not found on the page.");
  }

  // ... (remaining existing code)
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { checkLandmarkElements, checkSpecificClass }; // Update export to include the new function
}