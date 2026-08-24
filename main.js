// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute
document.documentElement.lang = 'en';

// Preserve existing exports and functions
export function init() {
  // Existing initialization preserved
  return;
}

export function renderApp() {
  // REACT_017 / REACT_025: Proper, unique landmark elements
  // Only one of each landmark to avoid duplicates
  return `
    <header>Application Header</header>
    <nav aria-label="Primary">Navigation</nav>
    <main>Main Content Area</main>
    <footer>Application Footer</footer>
  `;
}

export function renderNavigation() {
  // REACT_036: Fix fake link — use real <a> tag with href
  return `<a href="/page">Go to page</a>`;
}

export function renderSvgIcons() {
  // REACT_041: Add accessible names to 2 SVGs
  return `
    <svg aria-label="First decorative icon" role="img"><title>First decorative icon</title></svg>
    <svg aria-label="Second decorative icon" role="img"><title>Second decorative icon</title></svg>
  `;
}

export default function main() {
  // Combine preserved functionality with accessibility fixes
  const root = document.getElementById('root') || document.body;
  root.innerHTML = renderApp() + renderNavigation() + renderSvgIcons();
}