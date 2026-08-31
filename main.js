import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles.less';  // Note: Original was .css, keeping as specified
import App from './App';
import reportWebVitals from 'node-libs-react/report-validator';
import a11y from './AccessibilityUtilities';

// Additional imports from origin/main
const CONFIG = {
  dataPath: './data',
  maxResults: 100
};

// Imported utilities from origin/main
import { calculateSum } from './utils';
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';
import { checkLinkAccessibility } from './utils/linkAccessibilityUtils';
import { CONFIG: UTIL_CONFIG } from './utils/constants';

// Configuration
const CONFIG = {
  dataPath: './data',
  maxResults: 100
};

// New function to generate a report based on accessibility issues
function generateAccessibilityReport() {
  const options = {
    rules: [{ id: 'color-contrast' }, { id: 'aria-roles' }], // Customize allowed or ignored rules here
  };

  const report = axe.auditWebpage(document.body, options);
  return report;
}

// Function to add wrapper for main element to enhance accessibility
function wrapPrimaryContentInMain(parent) {
  if (!parent || typeof parent.nodeType !== 'number') {
    throw new Error('Invalid parent element');
  }

  // If already a main element, return as-is
  if (parent.tagName?.toLowerCase() === 'main') {
    return parent;
  }

  const mainElement = document.createElement('main');
  mainElement.appendChild(parent);

  return mainElement;
}

// Ensure unique landmarks by ID
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

const App = () => {
  const [programData, setProgramData] = useState(null);

  useEffect(() => {
    const loadProgramData = async () => {
      const filePath = path.join(CONFIG.dataPath, 'program.json');
      try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const parsedData = JSON.parse(data);
        setProgramData(parsedData);
      } catch (error) {
        console.error('Error loading program data:', error);
      }
    };
    loadProgramData();
  }, []);

  return (
    // ... Your accessible React Router setup ...
  );
};

// ... Your accessibility functions (merged both parties)

export default App;
module.exports = {
  ...module.exports, // Preserve existing functions
  generateAccessibilityReport,
  wrapPrimaryContentInMain,
  ensureUniqueLandmarks,
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  createInPageButton,
  validateInput,
  processData,
  formatResponse,
  config: CONFIG,
  isValidLandmark,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  landmarkConfig: CONFIG,
  generateAccessibilityReport,
  wrapPrimaryContentInMain,
  ensureUniqueLandmarks
};