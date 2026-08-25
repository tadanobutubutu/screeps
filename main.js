// Existing code...
document.addEventListener('DOMContentLoaded', function() {
  // Existing code that runs after the DOM is fully loaded
});

// New function to add lang attribute to the HTML element
function addLangAttribute() {
  const htmlElement = document.documentElement;
  htmlElement.setAttribute('lang', 'en'); // Assuming English, change as needed
}

// Call the function after the DOM content is loaded
document.addEventListener('DOMContentLoaded', addLangAttribute);

// Existing code...