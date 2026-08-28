// Main JavaScript file

function getLangAttribute() {
  // Get the language attribute from the document element
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.getAttribute('lang');
  }
  return null;
}

function getFullLangAttribute() {
  // Get the full language attribute including locale qualifiers
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang;
  }
  return null;
}

module.exports = {
  getLangAttribute,
  getFullLangAttribute
};