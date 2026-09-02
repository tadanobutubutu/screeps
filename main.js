// TODO: This is the existing code that needs to be preserve

// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// Existing code
export function existingFunction1() {
  // Existing implementation
}

export function existingFunction2() {
  // Existing implementation
}

// New Function (myNewFunction)
export function myNewFunction() {
  return "New function implemented successfully";
}

// Function from the original branch (ensureUniqueLandmarks)
function ensureUniqueLandmarks(landmarks, idField = 'id') {
    if (!Array.isArray(landmarks)) {
        return [];
    }

    const seen = new Set();
    const uniqueLandmarks = [];

    for (const landmark of landmarks) {
        if (!landmark || typeof landmark[idField] === 'undefined') {
            continue;
        }

        const landmarkId = typeof landmark[idField] === 'string' ? landmark[idField] : String(landmark[idField]);

        if (!seen.has(landmarkId)) {
            seen.add(landmarkId);
            uniqueLandmarks.push(landmark);
        }
    }

    return uniqueLandmarks;
}

// New function to add landmark roles and fix issues
function addLandmarkRoles(insightReport) {
  const issues = insightReport.issues || [];

  function validateLandmark(landmark) {
    const validRoles = ['main', 'navigation', 'banner', 'contentinfo', 'search', 'complementary', 'form', 'region'];
    const role = landmark.getAttribute('role');
    return validRoles.includes(role);
  }

  function validateLandmarkAttributes(landmark) {
    const ariaLabel = landmark.getAttribute('aria-label');
    const ariaLabelledBy = landmark.getAttribute('aria-labelledby');
    return !!(ariaLabel || ariaLabelledBy || landmark.textContent.trim());
  }

  /**
   * Validates landmark structure for accessibility issues
   * @returns {boolean} True if landmark structure is valid
   */
  function validateLandmarkStructure() {
    const requiredLandmarks = ['header', 'main', 'footer'];
    const missingLandmarks = [];

    requiredLandmarks.forEach(landmark => {
      if (!document.querySelector(landmark)) {
        missingLandmarks.push(landmark);
      }
    });

    if (missingLandmarks.length > 0) {
      console.warn(`Accessibility warning: Missing required landmarks: ${missingLandmarks.join(', ')}`);
      return false;
    }

    return true;
  }

  function getSvgAccessibleName(svg) {
    return svg.getAttribute('aria-label') ||
           svg.getAttribute('title') ||
           svg.querySelector('title')?.textContent ||
           'SVG graphic';
  }

  function setSvgAttributes(svg, name) {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', name);
  }

  function createInPageButton() {
    const button = document.createElement('button');
    button.textContent = 'Skip to content';
    button.addEventListener('click', function() {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus();
      }
    });
    return button;
  }

  // Additional helper functions
  function handleFakeLinks() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      if (!validateLinkAccessibility(link)) {
        link.setAttribute('aria-label', 'Link to ' + (link.href || 'unknown destination'));
      }
    });
  }

  function addProperLandmarkRegions() {
    // Ensure document has proper landmark structure
    const header = document.querySelector('header');
    if (header && !header.getAttribute('role')) {
      header.setAttribute('role', 'banner');
    }

    const footer = document.querySelector('footer');
    if (footer && !footer.getAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }

    const nav = document.querySelector('nav');
    if (nav && !nav.getAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }
  }

  /**
   * Generates a report based on accessibility issues
   * @returns {Object} The accessibility report
   */
  function generateAccessibilityReport() {
    const issues = [];

    // Check for images without alt attributes
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.hasAttribute('alt')) {
        issues.push({
          type: 'missing-alt',
          element: 'img',
          index: index,
          message: `Image at index ${index} is missing an alt attribute`
        });
      }
    });

    // Check for buttons without accessible name
    const buttons = document.querySelectorAll('button');
    buttons.forEach((btn, index) => {
      const accessibleName = btn.textContent.trim() || btn.getAttribute('aria-label') || btn.getAttribute('aria-labelledby');
      if (!accessibleName) {
        issues.push({
          type: 'missing-name',
          element: 'button',
          index: index,
          message: `Button at index ${index} is missing an accessible name`
        });
      }
    });

    // Check for links without accessible name
    const links = document.querySelectorAll('a');
    links.forEach((link, index) => {
      const accessibleName = link.textContent.trim() || link.getAttribute('aria-label') || link.getAttribute('aria-labelledby');
      if (!accessibleName) {
        issues.push({
          type: 'missing-name',
          element: 'a',
          index: index,
          message: `Link at index ${index} is missing an accessible name`
        });
      }
    });

    // Check for form inputs without labels
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input, index) => {
      const inputType = input.getAttribute('type');
      if (inputType && inputType !== 'hidden' && inputType !== 'submit' && inputType !== 'button' && inputType !== 'reset') {
        const labelId = input.getAttribute('aria-labelledby');
        const labelText = input.getAttribute('aria-label');
        const hasLabel = document.querySelector(`label[for="${input.id}"]`) || labelId || labelText;
        if (!hasLabel) {
          issues.push({
            type: 'missing-label',
            element: 'input',
            index: index,
            message: `Input at index ${index} is missing an associated label`
          });
        }
      }
    });

    // Check for empty headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading, index) => {
      if (!heading.textContent.trim()) {
        issues.push({
          type: 'empty-heading',
          element: 'heading',
          index: index,
          message: `Heading at index ${index} has no text content`
        });
      }
    });

    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      totalIssues: issues.length,
      issues: issues
    };

    console.log('Accessibility Report:', report);
    return report;
  }
}

// Utility functions
const { validateInput, processData } = require('./utils/validators');
const { formatResponse } = require('./utils/processor');

// Function to write the generated report to a file (writeReport)
function writeReport(report) {
  const reportFile = path.join(__dirname, 'accessibility_report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// Function to read the generated report (readReport)
function readReport() {
  const reportFile = path.join(__dirname, 'accessibility_report.json');
  return JSON.parse(fs.readFileSync(reportFile, 'utf8'));
}

// Function to generate a report based on accessibility issues (generateAccessibilityReport)
async function generateAccessibilityReport() {
  const report = await scanAccessibility();
  writeReport(report);
  return report;
}

// Helper functions for axe integration

async function scanAccessibility() {
    const results = await axe.run();
    return results;
}

// Function to validate landmark elements (validateLandmark)
function validateLandmark(landmarkElement) {
    const landmarkName = landmarkElement.tagName.toLowerCase();
    const requiredLandmarks = ['main', 'nav', 'footer'];

    if (!requiredLandmarks.includes(landmarkName)) {
        return {
            present: false,
            missing: []
        };
    }

    const landmark = document.querySelector(landmarkElement.tagName);

    if (!landmark) {
        return {
            present: false,
            missing: [landmarkName]
        };
    }

    return {
        present: true,
        missing: []
    };
}

// Function to validate landmarks (validateLandmarks)
function validateLandmarks(landmarks) {
    let validLandmarks = [];

    for (const landmark of landmarks) {
        const result = validateLandmark(landmark);

        if (result.present) {
            validLandmarks.push(landmark);
        }
    }

    return validLandmarks;
}

// Main execution when run directly
if (require.main === module) {
  const landmarks = loadLandmarks();
  const processed = processLandmarks(landmarks);
  const sorted = sortLandmarks(processed);

  console.log(`Loaded ${landmarks.length} landmarks`);
  console.log(`Processed to ${processed.length} unique landmarks`);
  console.log(`Sorted ${sorted.length} landmarks`);

  if (sorted.length > 0) {
    console.log('First landmark:', sorted[0]);
  }
}

/**
 * Handle credential response - parse, validate, and store credentials
 * This function should be called when a credential response is received
 */
async function handleCredentialResponse(response) {
    try {
        // Parse the response (assuming JSON format)
        const parsed = JSON.parse(response);
        // Validate the parsed data
        if (!validateInput(parsed)) {
            throw new Error('Invalid input');
        }
        // Process the data
        const processedData = processData(parsed);
        // Format the response
        const formattedResponse = formatResponse(processedData);
        return formattedResponse;
    } catch (error) {
        console.error('Error handling credential response:', error);
        throw error;
    }
}

// Add the functions from the conflicting branch
function sortLandmarks(landmarks, ascending = true) {
    return landmarks.slice().sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();

        if (ascending) {
            return nameA.localeCompare(nameB);
        }
        return nameB.localeCompare(nameA);
    });
}

function getLandmarkById(landmarks, id) {
    return landmarks.find(landmark => landmark.id === id) || null;
}

// Function to write a report based on missing or duplicate landmarks (reportMissingLandmarks)
function reportMissingLandmarks(landmarks, log = console.log) {
    const duplicateLandmarks = [];

    landmarks.forEach(landmark => {
        if (!landmark.id || landmark.id === '') {
            log('ERROR: Landmark missing id:', landmark);
        }

        const existingLandmark = getLandmarkById(landmarks, landmark.id);

        if (existingLandmark && existingLandmark !== landmark) {
            const uniqueLandmark = existingLandmark.id !== landmark.id ? existingLandmark : landmark;
            duplicateLandmarks.push({
                id: uniqueLandmark.id,
                duplicate: [landmark, ...duplicateLandmarks],
            });
        }
    });

    if (duplicateLandmarks.length > 0) {
        log('Duplicate landmarks found:', duplicateLandmarks);
    }
}