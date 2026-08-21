// main.js - Fix for REACT_027: Add scope attributes to table headers
function addScopeToTableHeaders(html) {
  // Add scope="col" to all <th> elements without a scope attribute
  return html.replace(/<th(?![^>]*\bscope=)/g, '<th scope="col"');
}
module.exports = { addScopeToTableHeaders };