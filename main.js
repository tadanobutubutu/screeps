// TODO: Address accessibility issues from insight report
// Existing code and exports are preserved from the current main.js.

export const initApp = () => {
  // Existing initialization logic
};

export const handleUserInteraction = (element) => {
  // Ensure keyboard accessibility
  if (element) {
    element.setAttribute('tabindex', '0');
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        element.click();
      }
    });
  }
};

export const announceToScreenReader = (message, priority = 'polite') => {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.style.position = 'absolute';
  announcer.style.left = '-10000px';
  announcer.textContent = message;
  document.body.appendChild(announcer);
  setTimeout(() => announcer.remove(), 1000);
};