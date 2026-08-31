import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from 'node-libs-react/report-validator';

import { CONFIG } from './utils/constants';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import { isSecureContext } from './utils.js';
import a11y from './AccessibilityUtilities';

// Load landmarks from file
function loadLandmarks() {
  try {
    const filePath = path.join(CONFIG.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
}

// Visualize the dependency tree
function visualizeDependencyTree(dependencies) {
  const report = generateDependencyReport(dependencies);
  console.log(report.graph);
}

// Helper function to generate dependency report
function generateDependencyReport(dependencies) {
  let graph = 'Dependency Tree:\n';
  dependencies.forEach(dep => {
    graph += `- ${dep.name}\n`;
  });
  return { graph };
}

// New function to fix accessibility issues as per the insight report
function fixAccessibilityIssues() {
  const results = [];
  
  // Validate and fix table accessibility
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const tableValidation = validateTableAccessibility(table);
    if (tableValidation && tableValidation.issues) {
      results.push(...tableValidation.issues);
    }
  });
  
  // Validate and fix landmark accessibility
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"]');
  landmarks.forEach(landmark => {
    const landmarkValidation = validateLandmark(landmark);
    if (landmarkValidation && landmarkValidation.issues) {
      results.push(...landmarkValidation.issues);
    }
  });
  
  // Validate and fix link accessibility
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const linkValidation = validateLinkAccessibility(link);
    if (linkValidation && linkValidation.issues) {
      results.push(...linkValidation.issues);
    }
  });
  
  // Handle fake links (links with href="#")
  handleFakeLinks();
  
  // Check for missing lang attribute
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    results.push({
      type: 'lang-missing',
      message: 'HTML element is missing lang attribute',
      element: htmlElement,
      severity: 'critical'
    });
  }
  
  // Check for duplicate IDs that may affect accessibility
  const ids = [];
  const duplicateIds = [];
  document.querySelectorAll('[id]').forEach(el => {
    if (ids.includes(el.id)) {
      duplicateIds.push(el.id);
    } else {
      ids.push(el.id);
    }
  });
  
  if (duplicateIds.length > 0) {
    results.push({
      type: 'duplicate-ids',
      message: 'Duplicate IDs found: ' + duplicateIds.join(', '),
      duplicateIds: duplicateIds,
      severity: 'error'
    });
  }
  
  return results;
}

// Main entry point for dependency visualization tool
export const main = {
  init: function() {
    console.log('Application initialized');
  },

  greet: function(name) {
    return `Hello, ${name}!`;
  },

  rotateBack: function() {
    // Your code to rotate back
    console.log('Reverting back the rotation.');
  },

  addressAccessibilityIssues: function() {
    fixAccessibilityIssues();
    a11y.validateAccessibility();
  }
};

function App() {
  const [initialized, setInitialized] = React.useState(main.init());

  React.useEffect(() => {
    main.init();
    setInitialized(main.init());
  }, []);

  React.useEffect(() => {
    main.addressAccessibilityIssues();
  }, [initialized]);

  return (
    <React.StrictMode>
      <App />
      {reportWebVitals()}
      <footer id="footer">
        <p>
          Built with love by the Screeps team. Powered by{' '}
          <a href="https://screeps.com/">Screeps</a>.
        </p>
      </footer>
    </React.StrictMode>
  );
}

App.propTypes = {
  // Do not modify this line
};

// Additional accessibility-related code changes:
// Ensure that all interactive elements have appropriate keyboard support
// Check that ARIA attributes are correctly paired and have appropriate values

// REACT_015: lang attribute should be added to the HTML element (typically in index.html)
// <html lang="en">

// REACT_017: Add landmark roles and fix landmark issues
// Add main landmark role to main content area
// Example: <main role="main">...</main>

// REACT_025: Ensure unique landmarks
// Ensure only one main landmark per page
// Use unique aria-label or aria-labelledby for landmark regions

// REACT_036: Fix fake link issue - convert <a href="#"> to <button> with proper ARIA
function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', 'rotate back');
  button.textContent = 'rotate back';
  button.addEventListener('click', rotateBack);
  return button;
}

// Replace fake links with proper buttons
const fakeLinks = document.querySelectorAll('a[href="#"]');
fakeLinks.forEach(fakeLink => {
  if (fakeLink && fakeLink.tagName === 'A') {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    if (parent) {
      parent.replaceChild(newButton, fakeLink);
    }
  }
});

// Process and filter landmarks (new addition)
function processLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }

    const validLandmarks = landmarks.filter(l => l && l.name);
    const uniqueLandmarks = [...new Set(validLandmarks.map(l => l.id))].map(id => validLandmarks.find(l => l.id === id));

    return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

// Sort landmarks by name (new addition)
function sortLandmarks(landmarks, ascending = true) {
    return landmarks.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();

        if (ascending) {
            return nameA.localeCompare(nameB);
        }
        return nameB.localeCompare(nameA);
    });
}

// Get landmark by ID (new addition)
function getLandmarkById(id) {
    const landmarks = loadLandmarks();
    return landmarks.find(landmark => landmark.id === id) || null;
}

// Ensure unique landmarks by ID (new addition)
function ensureUniqueLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }

    const seen = new Set();
    const uniqueLandmarks = [];

    for (const landmark of landmarks) {
        if (!landmark || typeof landmark.id === 'undefined') {
            continue;
        }

        const landmarkId = typeof landmark.id === 'string' ? landmark.id : String(landmark.id);

        if (!seen.has(landmarkId)) {
            seen.add(landmarkId);
            uniqueLandmarks.push(landmark);
        }
    }

    return uniqueLandmarks;
}

// Export functions for testing (new addition)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      loadLandmarks, processLandmarks, sortLandmarks, getLandmarkById, ensureUniqueLandmarks, fixAccessibilityIssues
    };
}

export default App;