// Existing code

function someExistingFunction() {
  // Existing function implementation
}

module.exports = {
  // Existing exports
};

// New functions implementation
function getLangAttribute(el) {
  return el.getAttribute('lang');
}

function getFullLangAttribute(el) {
  return el.getAttributeNS(null, 'xml:lang') || getLangAttribute(el);
}

// Existing code