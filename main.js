const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000,
  debug: true,
  version: '1.0.0'
};

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

function validateLandmark(landmark) {
  const errors = [];

  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }

  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }

  if (landmark.latitude === undefined || landmark.latitude === null) {
    errors.push('Landmark must have a latitude');
  } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
    errors.push('Landmark latitude must be a number');
  } else if (landmark.latitude < -90 || landmark.latitude > 90) {
    errors.push('Landmark latitude must be between -90 and 90');
  }

  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }

  if (Array.isArray(landmark)) {
    landmark.forEach((innerLandmark, index) => {
      if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
        errors.push(`Landmark at index ${index} must have a valid name`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function ensureLandmarkUniqueness(elements) {
  const elementsById = {};

  if (Array.isArray(elements)) {
    for (const landmark of elements) {
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          landmark.id += '_duplicate';
        } else {
          elementsById[landmark.id] = true;
        }
      }
    }
  }

  return elements;
}

function initializeApp() {
  appState.initialized = true;
  console.log('Initializing application...');
  return true;
}

function setupHandlers() {
  console.log('Setting up event handlers...');
}

function validateInput(input) {
  return input !== null && input !== undefined;
}

function processData(data) {
  if (!validateInput(data)) {
    throw new Error('Invalid input data');
  }
  return {
    processed: true,
    data: data,
    timestamp: Date.now()
  };
}

function getLangAttribute() {
  return 'en';
}

function personName(name) {
  return name || 'Unknown';
}

function validateTableAccessibility(table) {
  if (!table) return false;

  const hasCaption = table.querySelector('caption') !== null;
  const hasHeaderRow = table.querySelector('thead') !== null;
  const hasScopeAttributes = Array.from(table.querySelectorAll('th')).every(th =>
    th.hasAttribute('scope') && ['col', 'row', 'colgroup', 'rowgroup'].includes(th.getAttribute('scope'))
  );

  return hasCaption && hasHeaderRow && hasScopeAttributes;
}

function validateTableStructure(table) {
  if (!table) return false;

  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) return false;

  const firstRowCells = rows[0].querySelectorAll('th, td');
  const consistentColumns = Array.from(rows).every(row => {
    const cells = row.querySelectorAll('th, td');
    return cells.length === firstRowCells.length;
  });

  return consistentColumns;
}

function validateLandmarkStructure(landmark) {
  if (!landmark) return false;

  const requiredFields = ['name', 'latitude', 'longitude'];
  return requiredFields.every(field => landmark.hasOwnProperty(field));
}

function getSvgAccessibleName(svg) {
  if (!svg) return '';

  const title = svg.querySelector('title');
  const desc = svg.querySelector('desc');

  if (title) return title.textContent;
  if (desc) return desc.textContent;
  return svg.getAttribute('aria-label') || '';
}

function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', onClick);
  button.setAttribute('aria-label', text);
  return button;
}

function newFocusTrap(element) {
  if (!element) return;

  const focusableElements = element.querySelectorAll(
    'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  });

  firstElement.focus();
}

function main() {
  initializeApp();
  setupHandlers();
  return processData;
}

if (require.main === module) {
  main();
  console.log('Main function executed');
}

module.exports = {
  config,
  appState,
  validateLandmark,
  ensureLandmarkUniqueness,
  initializeApp,
  setupHandlers,
  validateInput,
  processData,
  main,
  getLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  newFocusTrap
};