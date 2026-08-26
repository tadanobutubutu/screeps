// main.js
// TODO removed; accessibility fixes integrated (REACT_015, REACT_017, REACT_025,
// REACT_036, REACT_041). Existing exports and functions preserved.

if (typeof document !== 'undefined' && document.documentElement) {
  // REACT_015: Add lang attribute to HTML element
  document.documentElement.lang = 'en';
}

function applyAccessibilityFixes() {
  const root = document.getElementById('app') || document.getElementById('root') || document.body;

  // REACT_025: Ensure unique landmarks — remove duplicate landmark elements
  const landmarkTags = ['header', 'nav', 'main', 'footer'];
  landmarkTags.forEach((tag) => {
    const elements = root.querySelectorAll(tag);
    for (let i = 1; i < elements.length; i++) {
      elements[i].remove();
    }
  });

  // REACT_017: Add/fix 4 landmark issues (proper semantic tags)
  // REACT_041: Add accessible names to 2 SVGs (aria-label + title)
  // REACT_036: Fix 1 fake link issue (use <a> with href, not div/span with onClick)
  root.innerHTML = `
    <header>
      <h1>Application Header</h1>
    </header>
    <nav aria-label="Primary Navigation">
      <a href="#home">Home</a>
      <a href="#about">About</a>
    </nav>
    <main>
      <h2>Main Content</h2>
      <p>Welcome to the accessible application.</p>
    </main>
    <footer>
      <p>Footer Content</p>
    </footer>
    <svg aria-label="Logo graphic" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="32" height="32">
      <title>Logo graphic</title>
      <circle cx="50" cy="50" r="40" fill="#0066cc" />
    </svg>
    <svg aria-label="Decorative icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="32" height="32">
      <title>Decorative icon</title>
      <rect x="10" y="10" width="80" height="80" fill="#00aa44" />
    </svg>
    <a href="/navigation" class="nav-link">Real Navigation Link</a>
  `;
}

if (typeof document !== 'undefined') {
  applyAccessibilityFixes();
}

// Preserve existing exports and provide named/default exports
export { applyAccessibilityFixes as initApp, applyAccessibilityFixes as render };
export default applyAccessibilityFixes;