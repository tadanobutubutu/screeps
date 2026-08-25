// Assuming the rest of the main.js file is intact and does not contain any code related to the HTML structure

// Add a function to update the HTML with the lang attribute if it's not already present
function updateHTMLLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (!htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en'); // Assuming the document is in English, change 'en' to the appropriate language code
  }
}

// Call the function when the document is loaded
document.addEventListener('DOMContentLoaded', updateHTMLLangAttribute);