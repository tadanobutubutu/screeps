// TODO: Implement this function for checking link and button accessibility

function checkLinkAndButtonAccessibility(element) {
  const issues = [];
  const tagName = element.tagName.toLowerCase();
  
  // Check if element is a link or button
  if (tagName !== 'a' && tagName !== 'button') {
    return { valid: true, issues: [] };
  }
  
  // Check for accessible name (text content, aria-label, aria-labelledby, or title)
  const textContent = element.textContent ? element.textContent.trim() : '';
  const ariaLabel = element.getAttribute('aria-label');
  const ariaLabelledby = element.getAttribute('aria-labelledby');
  const title = element.getAttribute('title');
  
  const hasAccessibleName = textContent.length > 0 || ariaLabel || ariaLabelledby || title;
  
  if (!hasAccessibleName) {
    issues.push('Link/button must have an accessible name (text content, aria-label, aria-labelledby, or title)');
  }
  
  // Additional checks for links
  if (tagName === 'a') {
    const href = element.getAttribute('href');
    if (!href || href === '#' || href === '') {
      issues.push('Link should have a valid href attribute');
    }
  }
  
  // Check for disabled buttons
  if (tagName === 'button') {
    const disabled = element.getAttribute('disabled');
    if (disabled !== null && disabled !== false) {
      const disabledText = textContent.toLowerCase();
      if (!disabledText.includes('disabled') && !ariaLabel && !ariaLabelledby) {
        issues.push('Disabled button should indicate disabled state in accessible name');
      }
    }
  }
  
  return {
    valid: issues.length === 0,
    issues: issues
  };
}

module.exports = { checkLinkAndButtonAccessibility };