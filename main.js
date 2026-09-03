const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const { a11y } = require('@accessible/react');
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks
} = require('./utils');

const CONFIG = {
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: 5000,
  debug: true,
  version: '1.0.0',
  name: 'MyApp'
};

const app = express();

// Register service worker only on production environment
if (process.env.NODE_ENV === 'production') {
  registerSW();
}

// Import styles
import './styles.css';

// Import utility functions
import { calculateSum, getFullLangAttribute } from './utils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkAccessibilityUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';
import addProperLandmarkRegions from './utils/landmarkUtils';
import { CONFIG } from './utils/constants';
import newFunction3 from './utils/newFunction3';
import newFunction4 from './utils/newFunction4';

// Set up configuration
const config = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: 5000,
};

// Application initialization and export
const initApp = () => {
  // Register service worker only on production environment
  if (process.env.NODE_ENV === 'production') {
    registerSW();
  }

  // Import styles
  import './styles.css';

  // Import utility functions
  import { calculateSum, getFullLangAttribute } from './utils';
  import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
  import { validateLandmark, validateLandmarkStructure } from './utils/landmarkAccessibilityUtils';
  import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
  import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';
  import addProperLandmarkRegions from './utils/landmarkUtils';
  import { CONFIG } from './utils/constants';
  import newFunction3 from './utils/newFunction3';
  import newFunction4 from './utils/newFunction4';

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();

  // Get and add lang attribute
  const langAttr = getLangAttribute();
  addLangAttribute(langAttr);

  // Initialize app
  initializeApp(app);

  // Set up middleware
  app.use(express.static(__dirname));
  app.get('/report', (req, res) => {
    axe.run(req.app.get('appInstance')).then(results => {
      const violations = results.violations.reduce((acc, violation) => {
        ViolationTypes[violation.id] && acc.push(ViolationTypes[violation.id]);
        return acc;
      }, []);
      res.json({ violations });
    });
  });

  app.get('/dependencies', (req, res) => {
    res.json(generateDependencyReport());
  });

  // Validate landmark and link accessibility on server-side
  app.post('/validate', (req, res) => {
    const { landmark, link } = req.body;
    const landmarkResult = validateLandmark(landmark);
    const linkResult = checkLinkAccessibility(link);
    res.json({ landmark: landmarkResult, link: linkResult });
  });

  const server = app.listen(5000, () => {
    console.log(`Listen on http://localhost:${server.address().port}`);
  });

  return server;
};

// Export the app instance
export default initApp;

// Utility functions
function loadLandmarks() {
  try {
    const filePath = path.join(__dirname, CONFIG.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
}

function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(isValidLandmark);

  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

function isValidLandmark(landmark) {
  if (!landmark) return false;
  return !!landmark.id && !!landmark.name;
}

function wrapPrimaryContentInMain() {
  const primaryContent = document.querySelector('.primary-content') ||
                        document.querySelector('[role="main"]') ||
                        document.getElementById('main-content') ||
                        document.querySelector('#content');

  if (primaryContent && !primaryContent.closest('main')) {
    const mainElement = document.createElement('main');
    primaryContent.parentNode.insertBefore(mainElement, primaryContent);
    mainElement.appendChild(primaryContent);
    return mainElement;
  }
  return null;
}

function addLangAttribute() {
  if (document && document.documentElement) {
    if (!document.documentElement.getAttribute('lang')) {
      document.documentElement.setAttribute('lang', getLangAttribute());
    }
  }
}

// Accessibility helpers
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';

  const title = svgElement.querySelector('title');
  if (title) {
    return title.textContent;
  }

  const desc = svgElement.querySelector('desc');
  if (desc) {
    return desc.textContent;
  }

  return svgElement.getAttribute('aria-label') || '';
}

function validateTableAccessibility(tableElement) {
  if (!tableElement) return false;

  const headers = tableElement.querySelectorAll('th');
  const cells = tableElement.querySelectorAll('td, th');

  for (const cell of cells) {
    if (!cell.id && !cell.getAttribute('scope')) {
      return false;
    }
  }

  return true;
}

function validateTableStructure(tableElement) {
  if (!tableElement) return false;

  const rows = tableElement.querySelectorAll('tr');
  let hasHeader = false;

  for (const row of rows) {
    const cells = row.querySelectorAll('th, td');
    for (const cell of cells) {
      if (cell.tagName.toLowerCase() === 'th') {
        hasHeader = true;
        if (!cell.getAttribute('scope')) {
          return false;
        }
      }
    }
  }

  return hasHeader;
}

async function scanAccessibility() {
  const violations = [];

  if (typeof document !== 'undefined') {
    const results = await axe.run(document);
    violations.push(...results.violations);
  }

  return { violations };
}

function validateLinkAccessibility() {
  const links = document.querySelectorAll('a[href]');

  for (const link of links) {
    if (!link.textContent.trim()) {
      return false;
    }
  }

  return true;
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('.fake-link');
  fakeLinks.forEach(link => {
    if (link.tagName === 'A' && !link.getAttribute('role')) {
      link.setAttribute('role', 'button');
    }
  });
}

function validateLandmark() {
  const landmarks = document.querySelectorAll(landmarkSelectors.join(','));
  return landmarks.length > 0;
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll(landmarkSelectors.join(','));

  for (const landmark of landmarks) {
    if (!landmark.id && !landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
      return false;
    }
  }

  return true;
}

// Google sign-in logic
googleSignIn.initialize(config.clientId);

// Function to validate book data for accessibility compliance
function validateBookAccessibility(bookData) {
  // Placeholder for implementation
  return true;
}

// Function to create an accessible book entry object
function createAccessibleBookEntry(bookData) {
  // Placeholder for implementation
  return bookData;
}

// Book endpoints
app.post('/books', express.json(), (req, res) => {
  // Implementation
  res.json({ message: 'Book created successfully' });
});

app.get('/books', (req, res) => {
  // Implementation
  res.json([]);
});

app.get('/books/:id', (req, res) => {
  // Implementation
  res.json({ id: '123', name: 'Test Book' });
});

app.put('/books/:id', express.json(), (req, res) => {
  // Implementation
  res.json({ id: '123', name: 'Updated Book' });
});

app.delete('/books/:id', (req, res) => {
  // Implementation
  res.json({ deleted: true });
});

function handleCredentialResponse(response) {
  try {
    const data = typeof response === 'string' ? JSON.parse(response) : response;

    if (!data || typeof data !== 'object') {
      appState.error = 'Invalid credential response format';
      return { success: false, error: 'Invalid credential response format' };
    }

    appState.credentials = data;

    return { success: true, data };
  } catch (error) {
    appState.error = error.message;
    return { success: false, error: error.message };
  }
}

function deduplicateLandmarks(landmarks) {
  // Placeholder for implementation
  return landmarks;
}

// Initialization function
function initialize() {
  console.log('Initializing application...');

  if (!isInitialized) {
    isInitialized = true;
    appState.initialized = true;

    const appData = {
      title: 'Screeps',
      version: CONFIG.version
    };

    addLangAttribute();
    wrapPrimaryContentInMain();
    fixFakeLinkIssues();
    ensureUniqueLandmarks();

    // Load landmarks for accessibility processing
    const landmarks = loadLandmarks();
    const processed = processLandmarks(landmarks);

    // Ensure the dependencyGraph container has a proper ARIA role
    if (dependencyGraph) {
      if (!dependencyGraph.id) {
        dependencyGraph.id = 'dependencyGraph';
      }
      if (!dependencyGraph.hasAttribute('role')) {
        dependencyGraph.setAttribute('role', 'region');
      }
      if (!dependencyGraph.hasAttribute('aria-label')) {
        dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
      }
    }
  }
}

// Export functions
export { initializeApp, config, initialize, handleCredentialResponse, newFunction3, newFunction4, googleSignIn, credentialHelper, recoverGoogleSignIn, handleLoginError, handleLoginButtonClick };

// Rendering helpers
function recoverGoogleSignIn() {
  googleSignIn.renderButton('google-signin-button');
}

function handleLoginError(error) {
  console.error('Login error:', error);
}

async function handleLoginButtonClick() {
  const isLoginPossible = await validateCredential();

  if (isLoginPossible) {
    console.log('User already logged in');
  } else {
    googleSignIn.renderButton('google-signin-button');
  }
}

// Render function
async function renderFunction1() {
  await accessiblyHelper();

  function wrapPrimaryContentInMain() {
    if (document.body.firstChild) {
      const wrapper = document.createElement('main');
      wrapper.innerHTML = document.body.innerHTML;
      document.body.innerHTML = '';
      document.body.appendChild(wrapper);
    }
  }
}