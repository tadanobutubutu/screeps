const config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: 5000,
  debug: false,
  version: '1.0.0',
  dataPath: './data',
  maxResults: 100,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  landmarkRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  maxLandmarks: 50
};

const CONFIG = {
  dataPath: './data',
  maxResults: 100,
  name: 'ScreepsBot',
  version: '1.0.0',
  debug: false,
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: 5000,
  landmarkRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
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

// ... (Unchanged rest of the code)