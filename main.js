// ... (existing code omitted)

// New function to address accessibility issues
function addressAccessibilityIssues() {
  const doc = document;
  const iconsEl = doc.querySelectorAll('[data-reactroot]:not([aria-hidden]) > svg');

  iconsEl.forEach((iconEl) => {
    const iconTextEl = iconEl.querySelector('text');

    if (iconTextEl) {
      iconEl.setAttribute('aria-hidden', 'true');
      iconTextEl.remove();
      iconTextEl.setAttribute('aria-label', iconEl.textContent);
      iconEl.appendChild(iconTextEl);
    }
  });
}

// ... (existing code omitted)