// main.js

document.addEventListener('DOMContentLoaded', function() {
  // Fix accessibility: add scope attributes to table header cells without scope
  var tableHeaders = document.querySelectorAll('th');
  tableHeaders.forEach(function(th) {
    if (!th.hasAttribute('scope')) {
      var row = th.parentElement;
      var section = row ? row.parentElement : null;

      if (section && section.tagName === 'THEAD') {
        th.setAttribute('scope', 'col');
      } else if (row && row.tagName === 'TR') {
        if (th === row.firstElementChild) {
          th.setAttribute('scope', 'row');
        } else {
          th.setAttribute('scope', 'col');
        }
      } else {
        th.setAttribute('scope', 'col');
      }
    }
  });

  const unrotateElement = document.getElementById('unrotate');
  
  if (unrotateElement && unrotateElement.tagName === 'A') {
    // Create a button to replace the fake link for better accessibility
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.textContent = unrotateElement.textContent;
    
    // Preserve classes and inline styles
    button.className = unrotateElement.className;
    if (unrotateElement.style.cssText) {
      button.style.cssText = unrotateElement.style.cssText;
    }
    
    // Add click handler for rotate back functionality
    button.addEventListener('click', function() {
      // Rotate back to original position
      document.body.style.transform = 'rotate(0deg)';
      document.body.style.transition = 'transform 0.3s ease';
    });
    
    // Replace the anchor with the button
    unrotateElement.parentNode.replaceChild(button, unrotateElement);
  }
});