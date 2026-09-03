// TODO: This is the modified and merged code
// This is the existing code that needs to be preserved in main.js
//_Commit: 3983c7bf3a9d6c99109e3c8293ba4f018fca6d94_
//<!-- todo-hash: 4b03b75f14168d98d014bcb3fe7f5d35f70503d4 -->


const fs = require('fs');
const main = require('./utilities');

const accessibilityUtils = {
  initSkipLink,
  trapFocus,
  newFocusTrap: (element) => {
    if (!element) return;
    const focusable = element.querySelectorAll(
      'a[href], button, textarea, input, select'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    return (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };
  },
  announceToScreenReader: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(() => announcer.remove(), 1000);
  },
  ensureElementId,
  addAriaLabel
};

module.exports = {
  ...main,
  ...accessibilityUtils,
  renderDependencyGraph,
  renderIndex,
  validateTableAccessibility,
  validateTableStructure,
  addAccessibleName,
  accessibilityUtils,
  ensureElementId,
  ensureElementHasId,
  newFocusTrap,
};