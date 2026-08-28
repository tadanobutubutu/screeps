// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

// REACT_015: Add lang attribute to HTML element
document.documentElement.setAttribute('lang', 'en');

// REACT_017: Add/fix 4 landmark issues
// Add main landmark to root element
const rootElement = document.getElementById('root');
if (rootElement) {
  rootElement.setAttribute('role', 'main');
}

// Additional landmarks should be added as needed (e.g., navigation, banner, contentinfo).

// REACT_025: Ensure unique landmarks (2 issues)
// Ensure each landmark role appears only once. This is typically done in UI components.

// REACT_036: Fix 1 fake link issue
// Replace fake links (anchors without href) with button role.
document.addEventListener('DOMContentLoaded', () => {
  const fakeLinks = document.querySelectorAll('a:not([href])');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  });
});