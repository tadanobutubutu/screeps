document.addEventListener('DOMContentLoaded', function() {
  // Preserve existing code from main.js
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

  // Wrap the primary content in a <main> element for accessibility
  function wrapPrimaryContentWithMain() {
    const primaryContent = document.querySelector('table[id="table-rotated"], .container');
    if (primaryContent) {
      const mainElement = document.createElement('main');
      mainElement.appendChild(primaryContent);
      primaryContent.parentNode.insertBefore(mainElement, primaryContent);
    }
  }

  // Call the function to wrap the primary content
  wrapPrimaryContentWithMain();

  // Add scope="col" to <th> elements that lack a scope attribute (REACT_027)
  // This ensures assistive technologies can programmatically associate
  // column headers with their corresponding data cells.
  function addScopeToTableHeaders() {
    const headerCells = document.querySelectorAll('table th');
    headerCells.forEach(function(th) {
      if (!th.hasAttribute('scope')) {
        // Determine if it's a row header (first cell in a row) or column header
        const parentRow = th.parentElement;
        const isFirstCell = parentRow && parentRow.firstElementChild === th;
        th.setAttribute('scope', isFirstCell ? 'row' : 'col');
      }
    });
  }

  // Apply scope attributes to all table headers
  addScopeToTableHeaders();
});