// TODO: Address accessibility issues from insight report — CONTINUING
function addAccessibilitySupport() {
  // Ensure the main chart has an accessible description
  const chartFigure = document.querySelector('figure[alt]');
  if (chartFigure) {
    const alt = chartFigure.getAttribute('alt') || 'Insight report chart showing key performance indicators';
    chartFigure.setAttribute('alt', alt);
  }

  // Add an accessible label to the submit button
  const submitBtn = document.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.setAttribute('aria-label', 'Submit feedback');
  }

  // Make the focus indicator visible for keyboard users
  document.body.style.focusVisible = 'outline';
}

addAccessibilitySupport();