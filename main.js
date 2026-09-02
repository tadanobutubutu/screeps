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
  // Existing code that should be preserved
  // Update landmark validation logic if needed
  const role = landmark.getAttribute('role');
  const validLandmarks = ['main', 'navigation', 'search', 'banner', 'contentinfo', 'complementary'];
  if (!validLandmarks.includes(role)) {
    errors.push('Invalid landmark role');
  }
  return errors;
}

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

const HTML = ({ lang }) => {
    return { lang };
};

function countDependencies() {
  try {
    const packageJson = require('./package.json');
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    const peerDependencies = packageJson.peerDependencies || {};
    const optionalDependencies = packageJson.optionalDependencies || {};

    return {
      dependencies: Object.keys(dependencies).length,
      devDependencies: Object.keys(devDependencies).length,
      peerDependencies: Object.keys(peerDependencies).length,
      optionalDependencies: Object.keys(optionalDependencies).length,
      total: Object.keys(dependencies).length + 
             Object.keys(devDependencies).length + 
             Object.keys(peerDependencies).length + 
             Object.keys(optionalDependencies).length
    };
  } catch (error) {
    return {
      dependencies: 0,
      devDependencies: 0,
      peerDependencies: 0,
      optionalDependencies: 0,
      total: 0,
      error: error.message
    };
  }
}

function validateTableAccessibility(tableElement) {
    // Implementation to validate table accessibility (conflict resolved: merged implementation)
    if (!tableElement.querySelector('caption')) {
        console.warn('Table missing caption');
        return false;
    }
    return true;
}

function validateTableStructure(tableElement) {
    // Implementation to validate table structure (conflict resolved: merged implementation)
    const rows = tableElement.querySelectorAll('tr');
    if (rows.length === 0) {
        console.warn('Table has no rows');
        return false;
    }
    return true;
}

function validateLandmarkStructure() {
    // Merged implementation (conflict resolved)
    const landmarks = document.querySelectorAll('[role]');
    let hasMain = false;
    let hasNavigation = false;

    landmarks.forEach(landmark => {
        const role = landmark.getAttribute('role');
        if (role === 'main') hasMain = true;
        if (role === 'navigation') hasNavigation = true;
    });

    if (!hasMain) console.warn('Missing main landmark');
    if (!hasNavigation) console.warn('Missing navigation landmark');

    return hasMain && hasNavigation;
}

function addLandmarkRegions() {
  console.log('Adding landmark regions');
}

function getSvgAccessibleName(svgElement) {
    // Merged implementation (conflict resolved)
    if (!svgElement) {
        return 'Accessible SVG Icon';
    }
    const title = svgElement.querySelector('title');
    const ariaLabel = svgElement.getAttribute('aria-label');
    if (title) return title.textContent;
    if (ariaLabel) return ariaLabel;
    return 'Accessible SVG Icon';
}

function setSvgAttributes(svg, accessibleName) {
  if (svg && typeof svg === 'object') {
    svg.setAttribute('role', 'img');
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }
  }
}

function ensureUniqueLandmarks(landmarksArg) {
  // Merged implementation (conflict resolved)
  let landmarks = landmarksArg;
  if (!Array.isArray(landmarks)) {
    landmarks = [];
  }
  const elementsById = {};

  if (Array.isArray(landmarks)) {
    for (const landmark of landmarks) {
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          landmark.id += '_duplicate';
        } else {
          elementsById[landmark.id] = true;
        }
      }
    }
  }

  // Additional uniqueness check for landmark roles
  const landmarksByRole = {};
  const allLandmarks = document.querySelectorAll('[role]');

  allLandmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (landmarksByRole[role]) {
      console.warn(`Duplicate landmark role: ${role}`);
    } else {
      landmarksByRole[role] = true;
    }
  });

  return landmarks;
}

function fixTableStructure(table) {
  if (!table.headers) {
    table.headers = 'auto';
  }

  if (!table.scope) {
    table.scope = 'auto';
  }

  return table;
}

function addMainLandmark(document) {
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    document.body.appendChild(main);
  }
  return document;
}

function handleCredentialResponse(credentialResponse) {
  if (!credentialResponse || typeof credentialResponse !== 'object') {
    throw new Error('Invalid credential response');
  }

  // Extract and validate required fields
  const { credential, clientExtensionResults, authenticatorData } = credentialResponse;

  if (!credential || typeof credential !== 'string') {
    throw new Error('Invalid credential in response');
  }

  // Process the credential data
  const processedCredential = {
    rawId: credential,
    id: credential,
    response: {
      clientDataJSON: credentialResponse.clientDataJSON,
      authenticatorData: authenticatorData || null,
      signature: credentialResponse.signature || null,
      userHandle: credentialResponse.userHandle || null
    },
    type: 'public-key',
    extensions: clientExtensionResults || {}
  };

  // Validate the processed credential
  if (!processedCredential.response.clientDataJSON) {
    throw new Error('Missing clientDataJSON in credential response');
  }

  return processedCredential;
}

function addProperLandmarkRegions(document) {
  const regions = [
    { selector: 'header', role: 'banner' },
    { selector: 'nav', role: 'navigation' },
    { selector: 'main', role: 'main' },
    { selector: 'aside', role: 'complementary' },
    { selector: 'footer', role: 'contentinfo' }
  ];

  regions.forEach(region => {
    const elements = document.querySelectorAll(region.selector);
    elements.forEach(element => {
      if (!element.getAttribute('role')) {
        element.setAttribute('role', region.role);
      }
    });
  });
}

function handleAccessibilityIssues() {
    // Implementation to handle accessibility issues (conflict resolved: merged implementation)
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        validateTableAccessibility(table);
        validateTableStructure(table);
    });

    const landmarks = document.querySelectorAll('[role]');
    landmarks.forEach(landmark => {
        validateLandmark(landmark);
    });

    validateLandmarkStructure();
    ensureUniqueLandmarks();

    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        getSvgAccessibleName(svg);
    });
}

// Export all existing and new functions
module.exports = {
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    ensureUniqueLandmarks,
    getSvgAccessibleName,
    createInPageButton,
    createAccessibleLink,
    fixTableStructure,
    addMainLandmark,
    setSvgAttributes,
    countDependencies,
    handleCredentialResponse,
    addProperLandmarkRegions,
    handleAccessibilityIssues,
    initializeApp,
    getConfig,
    validateInput,
    processData,
    addLandmarkRegions,
    setSvgAttributes
};