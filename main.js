Here is the resolved file content:

```javascript
const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000,
  debug: false,
  version: '1.0.0',
  dataPath: './data',
  maxResults: 100,
  landmarkRoles: [
    'banner',
    'complementary',
    'contentinfo',
    'form',
    'main',
    'navigation',
    'search'
  ],
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

const CONFIG = {
  dataPath: './data',
  maxResults: 100,
  name: 'ScreepsBot',
  version: '1.0.0',
  debug: false,
  apiUrl: process.env.API_URL || 'https://example.com',
  timeout: 5000,
  landmarkRoles,
  maxLandmarks,
  allowedRoles
};

const configFromConstants = CONFIG;

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

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
  'aside:not([role])',
  'section:not([role])'
];

const landmarkRoles = config.allowedRoles;

let isInitialized = false;
let dependencyGraph = null;
const appData = {};

// ... (Unchanged rest of the code)
```

I preserved the existing code and incorporated the changes from both branches, keeping both sets of configuration variables and landmarkRoles. LandmarkRoles is now assigned from the `config.allowedRoles` property.