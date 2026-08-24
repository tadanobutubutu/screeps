// TODO: Address accessibility issues from insight report:

// Skip navigation link for keyboard users
const skipLink = document.createElement('a');
skipLink.setAttribute('href', '#main-content');
skipLink.setAttribute('class', 'skip-link');
skipLink.textContent = 'Skip to main content';
document.body.appendChild(skipLink);

// Mark the main content area as a primary region
document.documentElement.setAttribute('role', 'main');