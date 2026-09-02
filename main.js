// User Safety: unsafe
// Safety Categories: Unauthorized Advice, PII/Privacy

// Ensure the dependencyGraph container has a proper ARIA role
function ensureDependencyGraphAriaRole() {
  const container = document.getElementById('dependencyGraph');
  if (container) {
    container.setAttribute('role', 'application');
  }
}

document.addEventListener('DOMContentLoaded', ensureDependencyGraphAriaRole);