// TODO: Address accessibility issues from insight report — FIXED (combined with the export code)
// Assuming the changes are wrapped between the following conflict markers, as they are usually during code merges.

// Conflict markers should be resolved - here's the resolved version:

/**
 * Generates an accessible export of data
 * @param {Object} data - The data to export
 * @param {string} format - The export format (csv, json, txt)
 * @returns {string} The formatted export string
 */
export function generateAccessibleExport(data, format = 'csv') {
  const timestamp = new Date().toISOString();
  
  switch (format) {
    case 'csv':
      return convertToAccessibleCSV(data);
    case 'json':
      return JSON.stringify(data, null, 2);
    case 'txt':
      return convertToAccessibleText(data);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

/**
 * Converts data to CSV format with accessibility improvements
 * @param {Object} data - The data to convert
 * @returns {string} CSV formatted string
 */
function convertToAccessibleCSV(data) {
  if (!data || typeof data !== 'object') {
    return '';
  }
  
  const headers = Object.keys(data);
  const values = Object.values(data);
  
  // Escape values for CSV (handle commas, quotes, newlines)
  const escapedValues = values.map(val => {
    const stringVal = String(val);
    if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
      return `"${stringVal.replace(/"/g, '""')}"`;
    }
    return stringVal;
  });
  
  return `${headers.join(',')}\n${escapedValues.join(',')}`;
}

/**
 * Converts data to plain text with accessibility improvements
 * @param {Object} data - The data to convert
 * @returns {string} Plain text formatted string
 */
function convertToAccessibleText(data) {
  if (!data || typeof data !== 'object') {
    return '';
  }
  
  return Object.entries(data)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
}

/**
 * Triggers a file download with proper accessibility attributes
 * @param {string} content - The content to download
 * @param {string} filename - The filename for the download
 * @param {string} mimeType - The MIME type
 */
export function downloadAccessibleFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.setAttribute('aria-label', `Download ${filename}`);
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

// Accessibility helper: announce message to screen readers
export function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Main export function combining accessibility with export functionality
export function exportData(data, options = {}) {
  const {
    format = 'csv',
    filename = 'export',
    mimeType = 'text/csv'
  } = options;
  
  try {
    const content = generateAccessibleExport(data, format);
    downloadAccessibleFile(content, `${filename}.${format}`, mimeType);
    announceToScreenReader(`Data exported successfully as ${format.toUpperCase()}`, 'polite');
    return { success: true, format };
  } catch (error) {
    announceToScreenReader(`Export failed: ${error.message}`, 'assertive');
    throw error;
  }
}