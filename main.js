// Address accessibility issues from insight report

// Focus trap for modals/dialogs
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
    if (e.key === 'Escape') {
      element.blur();
    }
  });
}

// Announce content to screen readers
function announceToScreenReader(message, priority = 'polite') {
  let announcer = document.getElementById('sr-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
  }
  announcer.setAttribute('aria-live', priority);
  announcer.textContent = '';
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);
}

// Skip link handler
function handleSkipLink(targetId) {
  const target = document.getElementById(targetId);
  if (target) {
    target.setAttribute('tabindex', '-1');
    target.focus();
  }
}

// Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Accessible hide/show toggle
function setAccessibleHidden(element, isHidden) {
  if (isHidden) {
    element.setAttribute('aria-hidden', 'true');
    element.setAttribute('hidden', '');
  } else {
    element.removeAttribute('aria-hidden');
    element.removeAttribute('hidden');
  }
}

// ----- END ORIGINAL CODE -----