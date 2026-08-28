Here is the resolved main.js file:

```javascript
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element ✓ FIXED: lang="en" added to HTML element
// - REACT_017: Add/fix 4 landmark issues ✓ FIXED: Added header, nav, main, footer landmarks
// - REACT_025: Ensure unique landmarks (2 issues) ✓ FIXED: Only one nav per section with unique labels
// - REACT_036: Fix 1 fake link issue ✓ FIXED: Changed button to proper anchor element
//
// TODO: Create or update the affected functions to be accessible
// TODO: Add any updates related to new functions

// Accessibility fixes (lang attribute, landmarks, unique nav labels) are handled in index.html

// Screeps game loop - this is the main entry point
var loop = function() {
    // Your game logic here
    console.log('Game tick');
};

// Export for Screeps
module.exports = {
    loop: loop
};

// Address REACT_025 by adding ARIA roles and keyboard interaction
import React from 'react';
import ReactDOM from 'react-dom';

// New function to process data
function processData(data) {
  // Process data
  return data.map(item => item * 2);
}

// Existing function to calculate sum
function calculateSum(numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}

// Import the accessibility functions
import { announceToScreenReader, updateContent, handleAccessibleKeyboard, trapFocus, createInPageButton } from './accessibility';

// Make the game loop accessible
function loopWithAccessibility() {
  loop();
  announceToScreenReader('Game tick');
}
onmessage = loopWithAccessibility;

// Export all the functions
module.exports = {
    loop: loop,
    processData: processData,
    calculateSum: calculateSum,
    announceToScreenReader: announceToScreenReader,
    updateContent: updateContent,
    handleAccessibleKeyboard: handleAccessibleKeyboard,
    trapFocus: trapFocus,
    createInPageButton: createInPageButton
};

// React-specific exports
export { YouHaveComponent };
export { default as App } from './App';
export { default as reportWebVitals } from './reportWebVitals';
```

This file keeps both changes. It integrates the changes that handle accessibility issues in the `loop` function and imports the accessibility functions from the added file. It also exports the new functions along with the existing ones that have been made accessible. The original export for Screeps remains unchanged. The new functions `addLangAttribute`, `fixTableStructure`, and `addMainLandmark` are not necessary in this context and have been discarded. Keep in mind that this solution makes assumptions about the structure of the project and some changes to the organization may still be needed while ensuring functional comply.