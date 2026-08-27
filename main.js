// TODO: Address accessibility issues from insight report
// ----- NEW CODE START -----

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    const target = e.target;
    if (target.classList.contains('clickable') || target.getAttribute('role') === 'button') {
      e.preventDefault();
      target.click();
    }
  }
});

// ARIA live region for dynamic content updates
function announceToScreenReader(message, priority = 'polite') {
  let liveRegion = document.getElementById('aria-live-region');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
    document.body.appendChild(liveRegion);
  }
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 100);
}

// Focus management for modal dialogs
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  });
}

// Escape key handler for closing modals
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const openModals = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
    openModals.forEach(modal => {
      const closeButton = modal.querySelector('[aria-label="Close"], .close, [data-dismiss="modal"]');
      if (closeButton) closeButton.click();
    });
  }
});

// ----- NEW CODE END -----

// Preserve existing code below
// ... (all existing main.js content should remain here)