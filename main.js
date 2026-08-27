// Example of how to add the lang attribute to the HTML element
function addLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', 'en'); // Assuming English is the default language
  }
}

// Call the function to set the lang attribute
addLangAttribute();