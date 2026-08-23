// Current content of main.js (before issue resolution)
// Note: This is a hypothetical example, the actual code may differ.
/*
  ...
  const rotateBack = () => {
    // Existing functionality for rotating back
  };

  // ... other code ...

  export { rotateBack };
  ...
*/

// Updated content of main.js (issue resolution)
const rotateBack = () => {
  // Existing functionality for rotating back
};

// Updated HTML element to be a button for proper keyboard and screen reader behavior
document.getElementById('unrotate').addEventListener('click', rotateBack);

// ... other code ...

export { rotateBack };