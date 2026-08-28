// main.js - Accessibility improvements implementation
// Merged HEAD and origin/main versions with conflict resolution

// Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())

const affectedFunctions = {
  getLangAttribute() {
    return document.documentElement.lang || 'en';
  },
  createInPageButton() {
    const button = document.createElement('button');
    button.textContent = 'Skip to main content';
    button.addEventListener('click', () => {
      const main = document.querySelector('main');
      if (main) {
        main.setAttribute('tabindex', '-1');
        main.focus();
      }
    });
    return button;
  },
};

// TODO: Preserve existing code

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
  a11yStore.init();
});

// TODO: Update affected functions to be accessible
// Preserve existing code
// a11yStore.preserveExistingCode();

// Standalone function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
  a11yStore.addressAccessibilityIssues(report);
}

// Export for module usage
export { a11yStore };
export { mainElement };
export { addressAccessibilityIssues };
export { getLangAttribute, createInPageButton };
export { newFunction };

// Default export for a11yStore
export default a11yStore;