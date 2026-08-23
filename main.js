(function() {
  var exports = {};

  // Preserved original content here
  
  // Add scope attributes to table headers
  exports.addScopeToTableHeaders = function() {
    var tableCells = document.querySelectorAll('.graph th:first-child');
    tableCells.forEach(function(cell) {
      cell.setAttribute('scope', 'col');
      cell.setAttribute('aria-label', 'Column Header');
    });
  };

  // Prevent DOM mutations from affecting scope attributes
  exports.configureMutationObserver = function() {
    var observer = new DOMMutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes') {
          var thElements = document.querySelectorAll('th:first-child');
          thElements.forEach(function(cell) {
            if (typeof cell.hasAttribute === 'function') {
              cell.setAttribute('scope', 'col');
              cell.setAttribute('aria-label', 'Column Header');
            } else {
              cell.scope = 'col';
            }
          });
        }
      });
    });
    observer.observe(document.body, { attributes: true, subtree: true });
  };

  // Preserved existing exclusions and rendering logic here

  // Set up Jest-compatible module exports
  module.exports = exports;
})();