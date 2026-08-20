// main.js

// Preserve existing code, exports, and functions
// ...

// Add wrapper function to wrap the existing main component if more than one exists
const wrapMain = (Component) => {
  if (document.querySelectorAll('main').length > 1) {
    const newMain = document.createElement('main');
    newMain.appendChild(Component);
    document.body.appendChild(newMain);
  } else {
    // This block will be skipped if there is only one main element
    // Replace `selector` with the appropriate selector for your application's main component
    const existingMain = document.querySelector('selector');
    existingMain.replaceWith(Component);
  }
};

// Wrap the main component with the provided wrapper function
wrapMain(YourMainComponent);

// Export the modified main component
export default YourMainComponent;