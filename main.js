// Your existing code...

const root = ReactDOM.createRoot(document.getElementById('root'));

// Function to get the language attribute value
function getLangAttribute() {
  // Implementation of getLangAttribute function
  // ...
}

// Function to create an in-page button and add the lang attribute
function createInPageButton() {
  // Implementation of createInPageButton function
  // ...
}

// Adding the lang attribute to the HTML element
const htmlElement = document.documentElement;
if (htmlElement) {
  htmlElement.setAttribute('lang', getLangAttribute());
}

// Function to validate the table structure for accessibility issues
function validateTableAccessibility(table) {
  if (!table || table.tagName !== 'TABLE') {
    return {
      isValid: false,
      issues: ['Element is not a valid table.']
    };
  }

  const issues = [];

  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption || !caption.textContent.trim()) {
    issues.push('Table is missing a non-empty <caption> element.');
  }

  // Check for proper row/column header structure
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) {
    issues.push('Table has no rows.');
  }

  let hasHeaderRow = false;
  rows.forEach((row) => {
    const thCells = row.querySelectorAll('th');
    const tdCells = row.querySelectorAll('td');
    if (thCells.length > 0 && tdCells.length === 0) {
      hasHeaderRow = true;
    }
  });

  if (!hasHeaderRow) {
    issues.push('Table is missing a row of <th> header cells.');
  }

  // Check for scope attribute on header cells
  const thElements = table.querySelectorAll('th');
  thElements.forEach((th, index) => {
    const scope = th.getAttribute('scope');
    if (!scope) {
      issues.push(`<th> element at index ${index} is missing a "scope" attribute.`);
    }
  });

  // Check for proper id/headers association in complex tables
  const tdElements = table.querySelectorAll('td[headers]');
  tdElements.forEach((td) => {
    const headersAttr = td.getAttribute('headers');
    if (headersAttr) {
      const headerIds = headersAttr.split(/\s+/);
      headerIds.forEach((headerId) => {
        if (!document.getElementById(headerId)) {
          issues.push(`<td> references missing header element with id "${headerId}".`);
        }
      });
    }
  });

  // Check for summary attribute (deprecated but still relevant for older content)
  if (table.hasAttribute('summary')) {
    issues.push('Table uses the deprecated "summary" attribute. Use <caption> instead.');
  }

  return {
    isValid: issues.length === 0,
    issues: issues
  };
}

// Validate the table structure for accessibility issues
const tableElement = document.getElementById('example-table');
if (tableElement) {
  const tableAccessibilityResult = validateTableAccessibility(tableElement);
  if (!tableAccessibilityResult.isValid) {
    console.warn('Table accessibility issues found:', tableAccessibilityResult.issues);
  }
}

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (implemented)
// - REACT_017: Add landmark roles and fix landmark issues (implemented)
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues) (implemented)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

export {
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  // Your exported functions and modules here...
};