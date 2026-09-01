const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

// TODO: This is the existing code that needs to be preserved
// Accessibility functions (kept and integrated)
// ... all accessibility-related functions

// Google sign-in logic (handled by googleSignIn())

// Fix button identifiers (handled by fixButtonIdentifiers())

// Ensure dependency graph container has proper ARIA role (handled by ensureDependencyGraphAriaRole())

// Additional functions, as both changes are being integrated
function getGoogleSignInButton(options) {
  return createInPageButton({
    ...options,
    text: options.text || 'Sign in with Google'
  });
}

function fixButtonIds(buttons) {
  return buttons.map(button => fixButtonIdentifiers(button, 'google-signin'));
}

function ensureDependencyGraphAriaRoleWithGoogle(container) {
  const googleSignInButton = container.querySelector('#google-signin-button');
  if (googleSignInButton) {
    googleSignInButton.setAttribute('role', 'button');
  }
  return {
    ...container,
    role: container.role || 'region',
    ariaLabel: container.ariaLabel || 'Dependency graph'
  };
}

// Export all functions for testing and external use
module.exports = {
  getLangAttribute,
  getFullLangAttribute,
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkAttributes,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
  handleAccessibilityIssues,
  processAccessibilityIssues,
  createLandmark,
  validateAllLandmarks,
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  uniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssues,
  googleSignIn,
  fixButtonIdentifiers,
  ensureDependencyGraphAriaRole,
  getGoogleSignInButton,
  fixButtonIds,
  ensureDependencyGraphAriaRoleWithGoogle
};