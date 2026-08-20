// Assuming this is the structure of the main.js file with the conflicting sections
// You would need to replace the existing content of the script tag with the following

document.addEventListener("DOMContentLoaded", function() {
  // ... existing code ...

  // Adding the lang attribute to the html tag
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', 'en');
  }

  // ... remaining code ...
});

// ... rest of main.js content ...