// Functions for adding proper landmark regions

const VERSION = '1.0.0';

const CONFIG = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  env: process.env.NODE_ENV || 'development'
};

function initialize() {
  console.log('Application initialized');
  return true;
}

function getConfig() {
  return CONFIG;
}

function getVersion() {
  return VERSION;
}

function createLandmarkRegion(type, content, attributes = {}) {
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];
  
  if (!landmarkRoles.includes(type)) {
    throw new Error(`Invalid landmark role: ${type}. Must be one of: ${landmarkRoles.join(', ')}`);
  }
  
  const element = document.createElement('div');
  element.setAttribute('role', type);
  
  if (typeof content === 'string') {
    element.textContent = content;
  } else if (content instanceof HTMLElement) {
    element.appendChild(content);
  }
  
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  
  return element;
}

function addLandmarkRegion(type, content, attributes = {}, targetElement = document.body) {
  const region = createLandmarkRegion(type, content, attributes);
  targetElement.appendChild(region);
  return region;
}

function initializeLandmarks(container = document.body) {
  const landmarks = {
    main: createLandmarkRegion('main', ''),
  };
  
  return landmarks;
}

module.exports = {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  createLandmarkRegion,
  addLandmarkRegion,
  initializeLandmarks
};

module.exports.default = {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  createLandmarkRegion,
  addLandmarkRegion,
  initializeLandmarks
};