import React from 'react';
import ReactDOM from 'react-dom';

// Other imports...

// Function to get language attribute from the document
const getLangAttribute = () => {
  if (typeof document !== 'undefined') {
    const htmlElement = document.documentElement;
    return htmlElement.getAttribute('lang');
  }
  return null;
};

// Function to validate table accessibility
const validateTableAccessibility = () => {
  const results = {
    valid: true,
    errors: []
  };

  if (typeof document !== 'undefined') {
    const tables = document.querySelectorAll('table');

    tables.forEach((table, index) => {
      const caption = table.querySelector('caption');
      const ariaLabel = table.getAttribute('aria-label');
      const ariaDescribedBy = table.getAttribute('aria-describedby');

      // Check if table has a caption, aria-label, or aria-describedby
      if (!caption && !ariaLabel && !ariaDescribedBy) {
        results.valid = false;
        results.errors.push(`Table ${index + 1}: Missing caption, aria-label, or aria-describedby`);
      }

      // Check if header cells have proper scope or are marked with role="columnheader"/"rowheader"
      const headers = table.querySelectorAll('th');
      headers.forEach((header, hIndex) => {
        const scope = header.getAttribute('scope');
        const role = header.getAttribute('role');

        if (!scope && !role) {
          results.valid = false;
          results.errors.push(`Table ${index + 1}, Header ${hIndex + 1}: Missing scope or role attribute`);
        }
      });
    });
  }

  return results;
};

// Function to validate table structure
const validateTableStructure = () => {
  const results = {
    valid: true,
    errors: []
  };

  if (typeof document !== 'undefined') {
    const tables = document.querySelectorAll('table');

    tables.forEach((table, index) => {
      const ths = table.querySelectorAll('th');
      const tds = table.querySelectorAll('td');

      // Check if number of ths and tds match
      if (ths.length !== tds.length) {
        results.valid = false;
        results.errors.push(`Table ${index + 1}: Number of th and td elements do not match`);
      }
    });
  }

  return results;
};

const Root = () => {
  // Other component code...
  
  const handleRotateBack = () => {
    // Logic to rotate back
  };

  // New function for example purposes
  const newFunction = () => {
    // Logic for the new function
  };

  // Add new validateTableStructure function validation
  const tableStructureError = validateTableStructure();
  if (!tableStructureError.valid) {
    console.error(tableStructureError.errors);
  }

  return (
    <html lang="en">
      {/* Other JSX elements... */}
      <main>
        <button id="unrotate" aria-label="Rotate back button" ... type="button">
          rotate back
        </button>
        {/* Example usage of new function */}
        <button onClick={newFunction} type="button">
          New Function
        </button>
      </main>
    </html>
  );
};

export { Root, handleRotateBack, newFunction, getLangAttribute, validateTableAccessibility };

ReactDOM.render(<Root />, ...);