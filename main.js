// Existing code from main.js...

// New function to add lang attribute to the HTML element
function addLangAttribute(lang) {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
}

// Assuming the function is to be used in a specific context, for example:
// addLangAttribute('en'); // Assuming English is the primary language

// Existing code from main.js...