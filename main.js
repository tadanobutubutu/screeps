// [Previous existing code remains unchanged]

// Add scope attributes to table headers in dependency-graph.html
// This is a temporary fix until the HTML can be properly generated with scope attributes
document.addEventListener('DOMContentLoaded', function() {
  // Select all th elements in the document
  const headers = document.querySelectorAll('th');

  headers.forEach(header => {
    // Check if the header already has a scope attribute
    if (!header.hasAttribute('scope')) {
      // Determine if it's a column or row header based on context
      if (header.closest('thead') || header.closest('tr:first-child')) {
        header.setAttribute('scope', 'col');
      } else if (header.closest('tr')) {
        header.setAttribute('scope', 'row');
      }
    }
  });
});

// Replace the non-interactive <a> element with a <button> for the 'rotate back' action
document.addEventListener('DOMContentLoaded', function() {
  const rotateBackLink = document.getElementById('unrotate');
  if (rotateBackLink) {
    // Remove the original <a> element
    rotateBackLink.parentNode.removeChild(rotateBackLink);

    // Create a new <button> element
    const rotateBackButton = document.createElement('button');
    rotateBackButton.id = 'unrotate';
    rotateBackButton.textContent = 'rotate back';

    // Replace the <a> with the <button>
    rotateBackButton.parentNode.replaceChild(rotateBackButton, rotateBackLink);
  }
});

// [Rest of existing code remains unchanged]