// Fix for REACT_027 - React Table Structure accessibility issues
// Add scope="col" to all <th> elements that are missing the scope attribute

(function() {
  'use strict';

  // Function to add scope attribute to th elements
  function addScopeToTableHeaders() {
    const thElements = document.querySelectorAll('th');
    
    thElements.forEach(function(th) {
      // Check if the th already has a scope attribute
      if (!th.hasAttribute('scope')) {
        // Determine if this is a column header or row header
        // Most th elements in tables are column headers
        const parent = th.parentNode;
        const isFirstCell = parent && parent.firstChild === th;
        
        // If it's the first cell in a row, it's likely a row header
        // Otherwise, treat it as a column header
        if (isFirstCell && th.cellIndex === 0) {
          th.setAttribute('scope', 'row');
        } else {
          th.setAttribute('scope', 'col');
        }
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addScopeToTableHeaders);
  } else {
    addScopeToTableHeaders();
  }

  // Also provide a utility function for programmatic use
  window.fixTableAccessibility = function(tableOrContainer) {
    const container = tableOrContainer || document;
    const thElements = container.querySelectorAll ? container.querySelectorAll('th') : [];
    
    thElements.forEach(function(th) {
      if (!th.hasAttribute('scope')) {
        const parent = th.parentNode;
        const isFirstCell = parent && parent.firstChild === th;
        
        if (isFirstCell && th.cellIndex === 0) {
          th.setAttribute('scope', 'row');
        } else {
          th.setAttribute('scope', 'col');
        }
      }
    });
  };

  // Export for module usage if available
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { addScopeToTableHeaders: addScopeToTableHeaders };
  }
})();