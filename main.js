/**
 * Adds the required lang attribute to the HTML element.
 */
function addLangAttribute() {
  const htmlElement = document.getElementById("root");
  if (htmlElement) {
    htmlElement.setAttribute("lang", "en");
  }
}

// ... Existing functions from main.js ...

module.exports = {
  // ... Existing exports from main.js ...
  addLangAttribute // Adding the new function for the accessibility issue
};