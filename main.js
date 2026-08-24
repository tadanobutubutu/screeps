// Existing code would be here...

// Fix for REACT_036: React Fake Link issue
// Convert the fake link with href="#" to a button for proper accessibility
export function fixFakeLinkAccessibility() {
  const fakeLink = document.getElementById('unrotate');
  if (fakeLink && fakeLink.tagName === 'A' && fakeLink.getAttribute('href') === '#') {
    const button = document.createElement('button');
    button.id = fakeLink.id;
    button.textContent = fakeLink.textContent;
    button.type = 'button';
    
    // Copy any existing event listeners by cloning them
    // In a real implementation, we'd need to properly transfer event listeners
    // For now, we'll just copy over common attributes
    if (fakeLink.hasAttribute('class')) {
      button.className = fakeLink.className;
    }
    if (fakeLink.hasAttribute('aria-label')) {
      button.setAttribute('aria-label', fakeLink.getAttribute('aria-label'));
    }
    
    // Transfer position in DOM
    const parent = fakeLink.parentNode;
    if (parent) {
      parent.replaceChild(button, fakeLink);
    }
    
    return button;
  }
  return null;
}

// Alternative approach: modify the HTML directly if working in DOM context
export function convertAnchorToButton(elementId, buttonText) {
  const anchor = document.getElementById(elementId);
  if (anchor && anchor.tagName === 'A') {
    const isFakeLink = anchor.getAttribute('href') === '#' || anchor.getAttribute('href') === '';
    
    if (isFakeLink) {
      const button = document.createElement('button');
      button.id = anchor.id;
      button.textContent = buttonText || anchor.textContent;
      button.type = 'button';
      
      // Preserve styling classes
      if (anchor.className) {
        button.className = anchor.className;
      }
      
      // Copy CSS custom properties if needed
      const computedStyle = window.getComputedStyle(anchor);
      // Transfer relevant styles manually if needed
      
      // Replace the anchor with button
      anchor.parentNode.replaceChild(button, anchor);
      
      return button;
    }
  }
  return null;
}