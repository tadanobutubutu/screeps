// Accessibility helper functions for React applications

/**
 * Adds lang attribute to HTML element for accessibility (REACT_015)
 * @param {string} lang - The language code (default: 'en')
 */
export function addLangAttribute(lang = 'en') {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
}

/**
 * Wraps primary content in <main> element so it can be skipped to
 * @param {React.ReactNode} children - The content to wrap
 * @returns {JSX.Element} - Main element with skip link support
 */
export function wrapPrimaryContentInMain(children) {
  return <main id="main-content" tabIndex={-1}>{children}</main>;
}

/**
 * Fixes error state in Dashboard by changing return path from <main> to <section>
 * @param {React.ReactNode} children - The error content to wrap
 * @returns {JSX.Element} - Section element with alert role for accessibility
 */
export function fixErrorStateInSection(children) {
  return <section role="alert" aria-live="assertive">{children}</section>;
}

/**
 * Removes tabIndex from main element after skip navigation
 */
export function handleSkipNavigation() {
  const mainElement = document.getElementById('main-content');
  if (mainElement) {
    mainElement.focus();
    mainElement.tabIndex = -1;
  }
}

// Default export with all accessibility utilities
export default {
  addLangAttribute,
  wrapPrimaryContentInMain,
  fixErrorStateInSection,
  handleSkipNavigation,
};