const config = {
  apiUrl: process.env.API_URL || 'https://api.default.com',
  timeout: 5000,
  debug: false,
  version: '1.0.0',
  dataPath: './data',
  maxResults: 100,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  landmarkRoles: [],
  maxLandmarks: 50
};

function validateConfig(cfg) {
  const errors = [];
  
  if (!cfg.apiUrl || typeof cfg.apiUrl !== 'string') {
    errors.push('apiUrl must be a valid string');
  }
  
  if (typeof cfg.timeout !== 'number' || cfg.timeout <= 0) {
    errors.push('timeout must be a positive number');
  }
  
  if (typeof cfg.debug !== 'boolean') {
    errors.push('debug must be a boolean');
  }
  
  if (!cfg.version || typeof cfg.version !== 'string') {
    errors.push('version must be a valid string');
  }
  
  if (!cfg.dataPath || typeof cfg.dataPath !== 'string') {
    errors.push('dataPath must be a valid string');
  }
  
  if (typeof cfg.maxResults !== 'number' || cfg.maxResults <= 0) {
    errors.push('maxResults must be a positive number');
  }
  
  if (!Array.isArray(cfg.allowedRoles) || cfg.allowedRoles.length === 0) {
    errors.push('allowedRoles must be a non-empty array');
  }
  
  if (typeof cfg.maxLandmarks !== 'number' || cfg.maxLandmarks <= 0) {
    errors.push('maxLandmarks must be a positive number');
  }
  
  return errors;
}

const validationErrors = validateConfig(config);
if (validationErrors.length > 0) {
  throw new Error('Configuration validation failed: ' + validationErrors.join(', '));
}

config.landmarkRoles = config.allowedRoles;

const CONFIG = {
  dataPath: config.dataPath,
  maxResults: config.maxResults,
  name: 'ScreepsBot',
  version: config.version,
  debug: config.debug,
  apiUrl: config.apiUrl,
  timeout: config.timeout,
  landmarkRoles: config.landmarkRoles,
  maxLandmarks: config.maxLandmarks,
  allowedRoles: config.allowedRoles
};

const landmarkSelectors = [
  '[role="banner"]',
  '[role="navigation"]',
  '[role="main"]',
  '[role="complementary"]',
  '[role="contentinfo"]',
  '[role="region"]',
  'header:not([role])',
  'nav:not([role])',
  'main:not([role])',
  'footer:not([role])',
  'section:not([role])'
];

function createLandmarkSelectors() {
  return landmarkSelectors.map(selector => ({
    selector,
    priority: landmarkSelectors.indexOf(selector)
  }));
}

module.exports = {
  CONFIG,
  config,
  landmarkSelectors,
  validateConfig,
  createLandmarkSelectors
};