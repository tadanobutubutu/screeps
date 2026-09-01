// This is a simple greeting module
function greet(name) {
  return `Hello, ${name}!`;
}

// Adding a function to set the lang attribute on the HTML element
function setLangAttribute(htmlElement) {
  htmlElement.setAttribute('lang', 'en');
}

// Using the function to set the lang attribute on the HTML element
(function () {
  const html = document.documentElement;
  setLangAttribute(html);
})();

// Your code here for addressing other accessibility issues mentioned in the issue

// Exporting the greet function as-is
module.exports = {
  greet,
};