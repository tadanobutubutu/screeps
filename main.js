import React from 'react';

const MyComponent = () => {
  // Existing component code

  // Add ARIA property role for better tab focusability
  const role = 'button';
  const inputRole = 'checkbox';

  return (
    <div>
      {/* Existing component JSX */}

      {/* Add role attribute for better tab focusability */}
      <button role={role}>Button with ARIA role</button>

      {/* Add role='checkbox' attribute for checkboxes */}
      <input type="checkbox" role={inputRole} />
    </div>
  );
};

/**
 * Checks accessibility of links and buttons in the document.
 * Validates that each link and button has an accessible name.
 * @returns {Object} Object containing array of accessibility issues for links and buttons
 */
function checkLinkAndButtonAccessibility() {
  const accessibilityIssues = {
    links: [],
    buttons: []
  };

  // Check links for accessible names
  const links = document.querySelectorAll('a');
  links.forEach((link, index) => {
    const hasTextContent = link.textContent.trim().length > 0;
    const hasAriaLabel = link.hasAttribute('aria-label') && link.getAttribute('aria-label').trim() !== '';
    const hasAriaLabelledBy = link.hasAttribute('aria-labelledby') && link.getAttribute('aria-labelledby').trim() !== '';
    const hasTitle = link.hasAttribute('title') && link.getAttribute('title').trim() !== '';

    if (!hasTextContent && !hasAriaLabel && !hasAriaLabelledBy && !hasTitle) {
      accessibilityIssues.links.push({
        element: link,
        index: index,
        message: 'Link missing accessible name. Provide text content, aria-label, aria-labelledby, or title attribute.'
      });
    }
  });

  // Check buttons for accessible names
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button, index) => {
    const hasTextContent = button.textContent.trim().length > 0;
    const hasAriaLabel = button.hasAttribute('aria-label') && button.getAttribute('aria-label').trim() !== '';
    const hasAriaLabelledBy = button.hasAttribute('aria-labelledby') && button.getAttribute('aria-labelledby').trim() !== '';
    const hasTitle = button.hasAttribute('title') && button.getAttribute('title').trim() !== '';

    if (!hasTextContent && !hasAriaLabel && !hasAriaLabelledBy && !hasTitle) {
      accessibilityIssues.buttons.push({
        element: button,
        index: index,
        message: 'Button missing accessible name. Provide text content, aria-label, aria-labelledby, or title attribute.'
      });
    }
  });

  return accessibilityIssues;
}

// Export MyComponent
export default MyComponent;

// Export the accessibility check function
export { checkLinkAndButtonAccessibility };