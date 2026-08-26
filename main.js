// main.js

/**
 * Validates table accessibility compliance
 * @param {HTMLElement} tableElement - The table element to validate
 * @returns {Object} Validation result with valid boolean and message
 */
function validateTableAccessibility(tableElement) {
  if (!tableElement) {
    return {
      valid: false,
      message: 'No table element provided'
    };
  }

  if (tableElement.tagName !== 'TABLE') {
    return {
      valid: false,
      message: 'Element is not a table'
    };
  }

  const headers = tableElement.querySelectorAll('th');
  const cells = tableElement.querySelectorAll('td');
  const rows = tableElement.querySelectorAll('tr');

  // Check if table has header cells when it has data cells
  if (cells.length > 0 && headers.length === 0) {
    return {
      valid: false,
      message: 'Tables with data cells should have header cells (th) for accessibility'
    };
  }

  // Check that all headers have proper scope or headers attributes
  let invalidHeaders = 0;
  headers.forEach((header) => {
    const hasScope = header.hasAttribute('scope');
    const hasHeaders = header.hasAttribute('headers');
    if (!hasScope && !hasHeaders) {
      invalidHeaders++;
    }
  });

  if (invalidHeaders > 0) {
    return {
      valid: false,
      message: `${invalidHeaders} header cell(s) missing required scope or headers attribute`
    };
  }

  // Check for caption in tables with multiple rows
  const hasCaption = tableElement.querySelector('caption') !== null;
  if (rows.length > 1 && !hasCaption) {
    return {
      valid: true,
      message: 'Table is accessible, but adding a caption would improve accessibility'
    };
  }

  return {
    valid: true,
    message: 'Table passes accessibility validation'
  };
}

// Export for use in other modules
module.exports = {
  validateTableAccessibility
};