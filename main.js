Here's the resolved version of the `main.js` file with both changes integrated:

```javascript
// ... (Pre-existing main.js content)

/**
 * Adds `aria-labelledby` to elements, if necessary
 * @param {HTMLElement} elem - Element to check aria-labelledby
 * @returns {void}
 */
function addAriaLabelledbyIfNeeded(elem) {
  if (elem) {
    const ids = [];
    const quasiIds = [];

    // Collect defined IDs and quasi-ids from child elements
    const collectIds = (current) => {
      if (!current) {
        return;
      }
      if (current.getAttribute('id')) {
        ids.push(current.getAttribute('id'));
      }
      if (current.hasAttribute('data-quasi-id')) {
        quasiIds.push(current.getAttribute('data-quasi-id'));
      }
      const children = current.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
          collectIds(child);
        }
      }
    };

    collectIds(elem);

    // Compose aria-labelledby from IDs and quasi-ids,
    // if there is at least one child element (avoids empty strings)
    const ariaLabelledbyValue = ids.length > 0 ? ids.join(' ') : (quasiIds.length > 0 ? quasiIds.join(' ') : undefined);

    if (ariaLabelledbyValue) { // Incorporated the change to only set aria-labelledby if not empty
      elem.setAttribute('aria-labelledby', ariaLabelledbyValue);
    }
  }
}

// Add a new function for adding `aria-labelledby` to elements on initialization
function initAriaLabels() {
  const elements = document.querySelectorAll('[data-init-aria-labels]');
  elements.forEach((elem) => {
    const id = elem.id || 'aria-label-' + Math.random().toString(36).substr(2, 9);
    elem.id = id;
    const labels = elem.querySelectorAll('label');
    labels.forEach((label) => {
      elem.setAttribute('aria-label', label.textContent);
    });
    addAriaLabelledbyIfNeeded(elem);
  });
}

// Update the event listener for the rotate button
const myButton = document.getElementById('rotate-btn');
if (myButton) {
  addAriaLabel(myButton, 'Rotate image clockwise');
  myButton.addEventListener('click', rotate);
}

// Update the event listener for the unrotate button
const unrotateButton = document.getElementById('unrotate-btn');
if (unrotateButton) {
  addAriaLabel(unrotateButton, 'Rotate image anti-clockwise');
  unrotateButton.addEventListener('click', rotateBack);
}

// New functions for landmark structure validation

// Check if landmark structure is valid
function validateLandmarkStructure(landmark) {
  // ... (Existing code)
}

// Validate landmark structure on elements
function validateLandmarks(landmarks) {
  // ... (Existing code)
}

// ... (Remaining unchanged content)

// Add a new function for validating landmark structure on elements
function validateLandmark(landmark) {
  // ... (Existing code with updated structure checks using validateLandmarkStructure)
}

// New functions for landmark validation export
module.exports = {
  // ... (Pre-existing exports)

  validateLandmarkStructure, // Add the new function to the exports
  validateLandmarks,         // Add the new function to the exports
  // ... (Remaining unchanged exports)
};
```

This resolved script properly integrates the changes, ensuring that both sets of changes are kept, and the updated `ariaLabelledbyIfNeeded` function now only sets the attribute if necessary (empty string checks have been added). Additionally, the new `validateLandmarkStructure` and `validateLandmarks` functions are included for landmark validation purposes.