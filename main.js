export function trapFocus(container) {
  const focusableSelectors = 'a[href], button, input[type="text"], input[type="button"], textarea, select, [tabindex]:not([tabindex="-1"])';
  const focusableElements = container.querySelectorAll(focusableSelectors);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  });

  // Add ARIA role and label attributes to an element for screen reader support
  function addAriaAttributes(element, role, label) {
    if (element) {
      element.setAttribute('role', role);
      element.setAttribute('aria-label', label);
    }
  }

  // Create an ARIA live region to announce dynamic content changes to screen readers
  function announceToScreenReader(message, priority = 'polite') {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'visually-hidden';
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-9999px';
    liveRegion.textContent = message;
    document.body.appendChild(liveRegion);

    setTimeout(() => {
      if (document.body.contains(liveRegion)) {
        document.body.removeChild(liveRegion);
      }
    }, 1000);
  }
}