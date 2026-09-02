const books = [];
const safetyCategory = "User Safety: unsafe";
const safetyCategories = ["Unauthorized Advice"];
const utils = require('./utils');

const CONFIG = {
    dataPath: './data',
    maxResults: 100
};

const config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

let isInitialized = false;
const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

const { getLangAttribute, addLangAttribute } = require('./utils');
const validateTableAccessibility = utils.validateTableAccessibility;
const validateTableStructure = utils.validateTableStructure;

function validateLandmark(landmark) {
  if (landmark && landmark.nodeType === Node.ELEMENT_NODE) {
    const issues = [];
    if (!landmark.tagName) {
      issues.push('Missing tagName');
    } else {
      const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
      if (!validLandmarks.includes(landmark.tagName.toLowerCase())) {
        issues.push(`Invalid landmark: ${landmark.tagName}`);
      }
    }
    if (landmark.getAttribute('role')) {
      const validRoles = ['main', 'navigation', 'search', 'banner', 'contentinfo', 'complementary'];
      const role = landmark.getAttribute('role');
      if (!validRoles.includes(role)) {
        issues.push('Invalid landmark role');
      }
    }
    if (issues.length > 0) {
      setLandmarkAttributes(landmark, getLangAttribute(), issues); // Added landmark attribute setting for language
    }
    return {
      success: issues.length === 0,
      issues
    };
  }
  return {
    success: false,
    issues: ['Invalid landmark: The provided argument is not a valid HTML element or null']
  };
}

function setLandmarkAttributes(landmark, lang, issues) {
  if (issues.length > 0) {
    landmark.setAttribute('role', 'landmark');
    if (lang) landmark.setAttribute('lang', lang);
  }
  return landmark;
}

function countDependencies() {
  let external = null;
  let error = null;
  if (typeof require === 'function') {
    try {
      const packageJson = require('./package.json');
      const dependencies = packageJson.dependencies || {};
      const devDependencies = packageJson.devDependencies || {};
      const peerDependencies = packageJson.peerDependencies || {};
      const optionalDependencies = packageJson.optionalDependencies || {};

      external = {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        peerDependencies: Object.keys(peerDependencies).length,
        optionalDependencies: Object.keys(optionalDependencies).length,
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length + Object.keys(peerDependencies).length + Object.keys(optionalDependencies).length
      };
    } catch (err) {
      error = err.message;
    }
  }

  // Return combined result
  if (error) {
    return {
      internalCount: 0,
      external,
      error
    };
  } else {
    return {
      internalCount: 0,
      external
    };
  }
}

function ensureUniqueLandmarks(landmarksArg) {
  let landmarks = landmarksArg;
  if (!Array.isArray(landmarks)) {
    landmarks = [];
  }
  const elementsById = {};

  if (Array.isArray(landmarks)) {
    for (let i = 0; i < landmarks.length; i++) {
      const landmark = landmarks[i];
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          landmark.id += '_duplicate';
        } else {
          elementsById[landmark.id] = true;
        }
      }
    }
  }

  const landmarksByRole = {};
  const allLandmarks = document.querySelectorAll('[role]');

  allLandmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (role) {
      if (landmarksByRole[role]) {
        console.warn('Duplicate landmark role: ' + role);
      } else {
        landmarksByRole[role] = true;
      }
    }
  });

  return {
    success: true,
    duplicates: []
  };
}

function validateTableAccessibility(tableElement) {
  if (!tableElement) {
      console.warn('Table missing caption');
      return false;
  }
  return validateTableStructure(tableElement);
}

function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

module.exports = {
    config,
    appState,
    validateLandmark,
    countDependencies,
    ensureUniqueLandmarks,
    validateTableAccessibility,
    formatDate
};