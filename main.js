// ... (existing code above line 168 remains unchanged)

/**
 * Checks accessibility of links and buttons in the DOM
 * @param {HTMLElement} element - The element to check (defaults to document.body)
 * @returns {Object} - Accessibility report with issues found
 */
function checkLinkAndButtonAccessibility(element = document.body) {
  const report = {
    links: [],
    buttons: [],
    totalIssues: 0
  };

  // Check links
  const links = element.querySelectorAll('a[href]');
  links.forEach(link => {
    const issues = [];

    // Check for missing ARIA attributes
    if (!link.getAttribute('aria-label') && !link.textContent.trim()) {
      issues.push('Missing aria-label or text content');
    }

    // Check for empty href
    if (link.getAttribute('href') === '#') {
      issues.push('Empty href attribute');
    }

    // Check for target="_blank" without rel="noopener noreferrer"
    if (link.getAttribute('target') === '_blank' &&
        !link.getAttribute('rel')?.includes('noopener noreferrer')) {
      issues.push('Missing rel="noopener noreferrer" for target="_blank"');
    }

    if (issues.length > 0) {
      report.links.push({
        element: link,
        issues
      });
      report.totalIssues += issues.length;
    }
  });

  // Check buttons
  const buttons = element.querySelectorAll('button');
  buttons.forEach(button => {
    const issues = [];

    // Check for missing ARIA attributes
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      issues.push('Missing aria-label or text content');
    }

    // Check for empty button
    if (!button.textContent.trim() && !button.querySelector('img, svg')) {
      issues.push('Empty button with no icon');
    }

    if (issues.length > 0) {
      report.buttons.push({
        element: button,
        issues
      });
      report.totalIssues += issues.length;
    }
  });

  return report;
}

// ... (rest of existing code remains unchanged)