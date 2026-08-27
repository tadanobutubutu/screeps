// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute

export function initializeApp() {
  // Set language attribute for accessibility
  document.documentElement.lang = 'en';
}

// Any other existing code...