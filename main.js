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
 * Checks link accessibility and returns accessibility status
 * @param {Object} linkElement - The link element or props to check
 * @param {string} linkElement.href - The href attribute of the link
 * @param {string} linkElement.textContent - The text content of the link
 * @param {string} linkElement.ariaLabel - Optional ARIA label for the link
 * @returns {Object} Accessibility check result with status and issues array
 */
export const checkLinkAccessibility = (linkElement) => {
  const issues = [];
  const { href, textContent, ariaLabel } = linkElement;

  // Check if href exists and is valid
  if (!href || href.trim() === '') {
    issues.push('Link is missing a valid href attribute');
  }

  // Check if link has accessible text
  const hasAccessibleText = ariaLabel && ariaLabel.trim() !== '';
  const hasTextContent = textContent && textContent.trim() !== '';

  if (!hasAccessibleText && !hasTextContent) {
    issues.push('Link has no accessible text content or aria-label');
  }

  // Check for common non-descriptive link text
  const nonDescriptiveTexts = ['click here', 'read more', 'learn more', 'here', 'more'];
  if (textContent && hasTextContent) {
    const lowerText = textContent.toLowerCase().trim();
    if (nonDescriptiveTexts.includes(lowerText)) {
      issues.push('Link text is not descriptive. Avoid generic text like "click here" or "read more"');
    }
  }

  // Return accessibility status
  return {
    isAccessible: issues.length === 0,
    issues: issues
  };
};

// Export MyComponent
export default MyComponent;