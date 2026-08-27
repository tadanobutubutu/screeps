import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'polyfill-io/stable';
import 'some-other-polyfill';

// Function to add lang attribute to the HTML element
const addLangAttribute = () => {
  const htmlElement = document.documentElement;
  if (!htmlElement.lang && navigator.language && navigator.language.length > 2) {
    htmlElement.lang = navigator.language.substring(0, 2);
  }
};

// New function to fix table structure issues
const fixTableStructure = (tables) => {
  if (!tables) {
    tables = document.querySelectorAll('table');
  }
  tables.forEach(table => {
    // ... (Existing code not related to the new function)

    // New function: checkTableCellScope
    const checkTableCellScope = (rows, headers) => {
      const totalColumns = headers.length;

      rows.forEach((row) => {
        const cells = row.querySelectorAll('td');

        if (cells.length < totalColumns) {
          throw new Error(`Row ${row.dataset.rowIndex} lacks cells for all columns at table ${table.dataset.tableIndex}`);
        }

        cells.forEach((cell, columnIndex) => {
          if (!cell.getAttribute('scope') && headers[columnIndex].getAttribute('scope') === 'col') {
            cell.setAttribute('scope', 'col');
          }
        });
      });
    };

    // Call the new function
    if (headers.length > 0 && rows.length > 0) {
      checkTableCellScope(rows, headers);
    }
  });
};

// New function to add/fix landmark issues
const addMainLandmark = () => {
  // ... (Existing code not related to the new function)
};

// New function to ensure unique landmarks
const ensureUniqueLandmarks = () => {
  // ... (Existing code not related to the new function)
};

// New function to add accessible names to SVGs
const addSvgAccessibleNames = () => {
  // ... (Existing code not related to the new function)
};

// New function to fix fake link issues
const fixFakeLinkIssue = () => {
  // ... (Existing code not related to the new function)
};

// New function to validate the landmarks
const validateLandmark = () => {
  // ... (Existing code not related to the new function)
};

// Export accessibility utilities
export {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  validateLandmark
};