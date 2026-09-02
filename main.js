const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
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
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  if (!landmark.tagName) {
    errors.push('Missing tagName');
  } else if (!validLandmarks.includes(landmark.tagName.toLowerCase())) {
    errors.push(`Invalid landmark: ${landmark.tagName}`);
  }

  if (errors.length > 0) {
    const role = landmark.getAttribute('role');
    if (role && !validLandmarks.includes(role)) {
      errors.push(`Invalid landmark role: ${role}`);
    }
  }

  return {
    success: errors.length === 0,
    issues: errors
  };
}

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

function getLangAttribute() {
  return document.documentElement.lang || navigator.language || 'en-US';
}

function getFullLangAttribute() {
  return document.documentElement.lang || navigator.language || 'en-US';
}

/**
 * Implements merge of the conflicting changes
 */
function mergeValidationFunctions(namespace) {
  const validationFunctions = {
    validateTableAccessibility,
    validateTableStructure
  };

  const conflictedFunctions = {
    validateLandmarkStructure,
    ensureUniqueLandmarks
  };

  for (const name of Object.keys(conflictedFunctions)) {
    if (validationFunctions[name]) {
      validationFunctions[name] = (...args) => {
        const result1 = validationFunctions[name](...args);
        const result2 = conflictedFunctions[name](...args);
        return {
          success: result1.success && result2.success,
          issues: [...result1.issues, ...result2.issues]
        };
      };
    } else {
      validationFunctions[name] = conflictedFunctions[name];
    }
  }

  for (const name of Object.keys(namespace)) {
    if (!validationFunctions[name]) {
      validationFunctions[name] = namespace[name];
    }
  }

  return validationFunctions;
}

const accessibilityValidationFunctions = mergeValidationFunctions({
  validateLandmark
});

module.exports = {
  config,
  appState,
  appData,
  accessibilityValidationFunctions,
  getLangAttribute,
  getFullLangAttribute
};