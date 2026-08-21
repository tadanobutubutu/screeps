// main.js
// Fix for REACT_027: Add scope attribute to <th> for accessibility.

function ensureScopeAttribute() {
  if (typeof document !== 'undefined') {
    const tableHeaders = document.querySelectorAll('th');
    tableHeaders.forEach(header => {
      if (header.getAttribute('scope') === null) {
        header.setAttribute('scope', 'col');
      }
    });
  }
}

// Run immediately if in a browser environment
if (typeof window !== 'undefined') {
  ensureScopeAttribute();
}

module.exports = { ensureScopeAttribute };