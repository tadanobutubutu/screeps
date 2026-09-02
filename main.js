import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

let icons = {};

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// Updated function: ensures landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  if (!Array.isArray(elements)) {
    return [];
  }

  const uniqueElements = [];
  const seen = new Map();

  elements.forEach(element => {
    const key = element.id || element.name || ...
    if (!seen.has(key)) {
      seen.set(key, true);
      uniqueElements.push(element);
    }
  });

  return uniqueElements;
}

// Updated function using the new functions for rendering graph/index
function renderDependencyGraphContent() {
  const container = ...
  if (!container) {
    return;
  }

  // Use the new functions for rendering
  renderDependencyGraph(container);
  renderIndexView(container);
}

// Handle credential response logic
function handleCredentialResponse(credentialResponse) {
  // Validate that a response was provided
  if (!credentialResponse) {
    return {
      success: false,
      error: 'No credential response provided'
    };
  }

  // Check for required fields in the credential response
  const { token, user, refreshToken, expiresIn } = credentialResponse;

  if (!token) {
    return {
      success: false,
      error: 'Invalid credential response: missing token'
    };
  }

  if (!user) {
    return {
      success: false,
      error: 'Invalid credential response: missing user information'
    };
  }

  try {
    // Store authentication token
    localStorage.setItem('authToken', token);

    // Store refresh token if provided
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    // Store token expiration time if provided
    if (expiresIn) {
      const expirationTime = Date.now() + (expiresIn * 1000);
      localStorage.setItem('tokenExpiration', expirationTime.toString());
    }

    // Store user data
    localStorage.setItem('userData', JSON.stringify(user));

    // Update app state with authenticated user info
    appData.authenticated = true;
    appData.currentUser = user;

    // Trigger authentication state update
    if (typeof onAuthStateChanged === 'function') {
      onAuthStateChanged(true, user);
    }

    return {
      success: true,
      user: user,
      token: token
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to store credentials: ${error.message}`
    };
  }
}

// Address all accessibility issues
function addressInsightIssues() {
  getLangAttribute();
  addLangAttribute();
  ensureUniqueLandmarks(landmarks);
  addMainLandmark();
  ...
  ensureLandmarkUniqueness(landmarks);
  fixFakeLinkIssue();
  ...
}

// Initialize app
function initializeApp() {
  addressInsightIssues();
  ...
}

// Export all functions
export {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  createAccessibleLink,
  handleAccessibilityIssues,
  validateLandmarkData,
  ensureLandmarkUniqueness,
  renderDependencyGraphContent,
  addLangAttribute,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  fixTableStructure,
  addressInsightIssues,
  handleCredentialResponse,
  landmarks,
  appData,
  icons
};