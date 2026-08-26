// main.js (ESLint config example)
module.exports = {
  // ... existing config
  rules: {
    // ... existing rules
    // To allow aria-hidden="true" for decorative SVGs:
    'jsx-a11y/aria-proptypes': 'warn',
    
    // Or to disable this specific rule if decorative:
    // 'jsx-a11y/aria-proptypes': 'off',
  }
};