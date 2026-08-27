// Existing code from main.js
// ...

// New function or changes requested in the issue
function wrapContentInMain() {
  const mainContent = document.querySelector('main');
  if (!mainContent) {
    const newMain = document.createElement('main');
    document.body.insertBefore(newMain, document.body.firstChild);
    document.body.removeChild(mainContent);
  }
}

// Call the function to wrap the content in <main> if it's not already there
wrapContentInMain();

// Existing code from main.js
// ...