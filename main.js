// main.js - Fixed with SVG accessibility compliance (REACT_027, REACT_041)

/**
 * Returns accessibility attributes for SVG elements
 * Use this for decorative SVGs that don't need to be announced
 * @param {boolean} isDecorative - Whether the SVG is purely decorative
 * @param {string} [ariaLabel] - Optional accessible name
 * @returns {Object} Accessibility props to spread onto <svg>
 */
export function getSVGAriaProps(isDecorative = false, ariaLabel) {
  if (isDecorative) {
    return { 'aria-hidden': 'true' };
  }
  
  if (ariaLabel) {
    return { 'aria-label': ariaLabel, role: 'img' };
  }
  
  // Fallback: add role for better screen reader support
  return { role: 'img' };
}

// Example usage in layout files:
// 
// BEFORE (accessibility warning):
// <svg viewBox="0 0 32 32" width="32" height="32">
//   <path d="..." />
// </svg>
//
// AFTER (fixed - decorative SVG):
// <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
//   <path d="..." />
// </svg>
//
// AFTER (fixed - with accessible name):
// <svg viewBox="0 0 32 32" width="32" height="32" aria-label="Application logo">
//   <title>Application logo</title>
//   <path d="..." />
// </svg>

/**
 * Validates SVG accessibility compliance
 * @param {Object} svgProps - Props from an SVG element
 * @returns {{compliant: boolean, issues: string[]}}
 */
export function validateSVGAccessibility(svgProps) {
  const issues = [];
  
  const hasAriaHidden = svgProps['aria-hidden'] === 'true';
  const hasAriaLabel = !!svgProps['aria-label'];
  const hasRole = svgProps.role === 'img';
  const hasTitleChild = svgProps.children && 
    (Array.isArray(svgProps.children) 
      ? svgProps.children.some(c => c && c.type === 'title')
      : svgProps.children.type === 'title');
  
  const isCompliant = hasAriaHidden || hasAriaLabel || hasTitleChild || hasRole;
  
  if (!isCompliant) {
    issues.push('SVG has no accessible name and is not hidden');
  }
  
  return { compliant: isCompliant, issues };
}

/**
 * Returns scope attribute for table header cells
 * Use this for <th> elements to ensure proper accessibility
 * @param {Object} options - Configuration options
 * @param {boolean} options.isColumnHeader - Whether this is a column header
 * @param {boolean} options.isRowHeader - Whether this is a row header
 * @param {boolean} options.isCornerCell - Whether this is a corner/stub cell
 * @returns {string} The scope attribute value
 */
export function getTableHeaderScope({ isColumnHeader = false, isRowHeader = false, isCornerCell = false }) {
  if (isCornerCell) {
    return ''; // Corner cells typically don't need a scope
  }
  
  if (isColumnHeader) {
    return 'col';
  }
  
  if (isRowHeader) {
    return 'row';
  }
  
  return ''; // Default: no scope attribute
}

/**
 * Generates accessibility attributes for table header cells
 * @param {Object} options - Configuration options
 * @param {boolean} options.isColumnHeader - Whether this is a column header
 * @param {boolean} options.isRowHeader - Whether this is a row header
 * @param {boolean} options.isCornerCell - Whether this is a corner/stub cell
 * @returns {Object} Props object to spread onto <th> element
 */
export function getTableHeaderAriaProps(options) {
  const scope = getTableHeaderScope(options);
  
  return {
    ...(scope && { scope })
  };
}

/**
 * Validates table accessibility compliance
 * @param {Array<Array>} tableData - 2D array of table cell data
 * @param {Object} options - Configuration options
 * @param {Array<string>} options.columnHeaders - Column header text
 * @param {Array<string>} options.rowHeaders - Row header text
 * @returns {{compliant: boolean, issues: string[]}}
 */
export function validateTableAccessibility(tableData, options = {}) {
  const issues = [];
  const { columnHeaders = [], rowHeaders = [] } = options;
  
  // Check if table has headers
  if (columnHeaders.length === 0 && rowHeaders.length === 0) {
    issues.push('Table has no headers defined');
  }
  
  // Validate column headers
  columnHeaders.forEach((header, index) => {
    if (!header || !header.trim()) {
      issues.push(`Column header at index ${index} is empty`);
    }
  });
  
  // Validate row headers
  rowHeaders.forEach((header, index) => {
    if (!header || !header.trim()) {
      issues.push(`Row header at index ${index} is empty`);
    }
  });
  
  // Check data alignment
  if (tableData.length > 0) {
    const rowCount = tableData.length;
    const colCount = tableData[0]?.length || 0;
    
    tableData.forEach((row, rowIndex) => {
      if (row.length !== colCount) {
        issues.push(`Row ${rowIndex} has inconsistent column count`);
      }
    });
  }
  
  return {
    compliant: issues.length === 0,
    issues
  };
}

export default {
  getSVGAriaProps,
  validateSVGAccessibility,
  getTableHeaderScope,
  getTableHeaderAriaProps,
  validateTableAccessibility
};