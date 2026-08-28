// main.js

/**
 * Checks all links and buttons in the document for accessibility issues.
 * Returns an array of accessibility violations found.
 * @param {Document} document - The DOM document to check
 * @returns {Array} Array of accessibility issues found
 */
function checkLinkAndButtonAccessibility(document) {
  const issues = [];
  
  // Check links for accessibility
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const hasText = link.textContent.trim().length > 0;
    const hasAriaLabel = link.getAttribute('aria-label');
    const hasAriaLabelledby = link.getAttribute('aria-labelledby');
    const hasTitle = link.getAttribute('title');
    const hasImgWithAlt = link.querySelector('img[alt]');
    
    if (!hasText && !hasAriaLabel && !hasAriaLabelledby && !hasTitle && !hasImgWithAlt) {
      issues.push({
        type: 'link',
        element: link,
        message: 'Link missing accessible name (aria-label, aria-labelledby, title, or text content required)'
      });
    }
    
    // Check for generic link text that doesn't describe the destination
    const genericTexts = ['click here', 'here', 'read more', 'learn more', 'link', 'more'];
    const linkTextLower = link.textContent.trim().toLowerCase();
    if (genericTexts.includes(linkTextLower) && !hasAriaLabel && !hasAriaLabelledby) {
      issues.push({
        type: 'link',
        element: link,
        message: 'Link text is too generic and does not describe the destination'
      });
    }
  });
  
  // Check buttons for accessibility
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    const hasText = button.textContent.trim().length > 0;
    const hasAriaLabel = button.getAttribute('aria-label');
    const hasAriaLabelledby = button.getAttribute('aria-labelledby');
    const hasTitle = button.getAttribute('title');
    const hasAriaHidden = button.getAttribute('aria-hidden') === 'true';
    
    if (hasAriaHidden) {
      return; // Skip aria-hidden buttons
    }
    
    if (!hasText && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
      issues.push({
        type: 'button',
        element: button,
        message: 'Button missing accessible name (aria-label, aria-labelledby, title, or text content required)'
      });
    }
  });
  
  return issues;
}

// Rest of the existing code...