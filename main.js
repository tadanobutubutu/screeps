// TODO: This is the existing code that needs to be preserved

// Add lang attribute to HTML element
function addLangAttribute(lang) {
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
        htmlElement.setAttribute('lang', lang);
    }
}

module.exports = {
  myFunction: function () {
    // Existing implementation
  },
  addLangAttribute: addLangAttribute
}