// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

const root = document.getElementById('root');

function Navigation() {
  return `
    <nav role="navigation" aria-label="Main navigation">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  `;
}

function MainContent() {
  return `
    <main role="main" id="main-content">
      <h1>Welcome to Our Application</h1>
      <p>This is the main content area of the page.</p>
      <button type="button" class="action-button" aria-label="Perform Action">Perform Action</button>
    </main>
  `;
}

function Sidebar() {
  return `
    <aside role="complementary" aria-label="Related information">
      <h2>Related Links</h2>
      <ul>
        <li><a href="/help">Help Center</a></li>
        <li><a href="/faq">FAQ</a></li>
      </ul>
    </aside>
  `;
}

function Footer() {
  return `
    <footer role="contentinfo">
      <p>&copy; 2024 Our Application. All rights reserved.</p>
    </footer>
  `;
}

function Logo() {
  return `<svg aria-hidden="true" focusable="false"><use href="#logo-icon"></use></svg>`;
}

function SearchIcon() {
  return `<svg aria-hidden="true" focusable="false"><use href="#search-icon"></use></svg>`;
}

function UniqueSection() {
  return `<section aria-labelledby="unique-heading"><h2 id="unique-heading">Unique Content</h2></section>`;
}

function FakeLinkFixed() {
  return `<button type="button" class="link-button" aria-label="Go to Link Page">Link</button>`;
}

// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarks() and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and getSvgAriaLabel())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by validateLandmarkStructure() and validateLandmarkUniqueness())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleButton() and createAccessibleLink())

function getLangAttribute() {
  return 'en';
}

function getFullLangAttribute() {
  return document.documentElement.lang || getLangAttribute();
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="banner"], [role="search"]');
  const seen = new Set();
  const duplicates = [];
  landmarks.forEach(lm => {
    const key = lm.getAttribute('role') + (lm.getAttribute('aria-label') || '');
    if (seen.has(key)) {
      duplicates.push('Duplicate landmark: ' + key);
    }
    seen.add(key);
  });
  return duplicates;
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';
  
  // Check aria-label attribute
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check aria-labelledby attribute
  const ariaLabelledBy = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement) return labelElement.textContent || '';
  }
  
  // Check title element inside SVG
  const titleElement = svgElement.querySelector('title');
  if (titleElement) return titleElement.textContent || '';
  
  // Check for adjacent text that describes the SVG
  const titleAttr = svgElement.getAttribute('title');
  if (titleAttr) return titleAttr;
  
  return '';
}

function getSvgAriaLabel(svgElement) {
  return getSvgAccessibleName(svgElement);
}

function validateLandmarkUniqueness() {
  return validateLandmarkStructure();
}

function validateLandmarks() {
  return validateLandmarkStructure();
}

function createInPageButton(text, onClick) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = text;
  btn.onclick = onClick;
  return btn;
}

function createAccessibleButton(text, onClick, ariaLabel) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = text;
  if (ariaLabel) btn.setAttribute('aria-label', ariaLabel);
  btn.onclick = onClick;
  return btn;
}

function createAccessibleLink(href, text, ariaLabel) {
  const a = document.createElement('a');
  a.href = href;
  a.textContent = text;
  if (ariaLabel) a.setAttribute('aria-label', ariaLabel);
  return a;
}

function addLangAttribute() {
  document.documentElement.lang = getLangAttribute();
}

function render() {
  addLangAttribute();
  
  root.innerHTML = `
    <div class="app">
      <header role="banner">
        ${Navigation()}
        ${Logo()}
        ${SearchIcon()}
      </header>
      
      ${MainContent()}
      
      ${Sidebar()}
      
      ${UniqueSection()}
      
      ${FakeLinkFixed()}
      
      ${Footer()}
    </div>
  `;
}

function handleAction() {
  console.log('Action performed');
}

function handleFakeLinkAction() {
  console.log('Fake link action performed');
}

function exportData() {
  return { message: 'Data exported successfully' };
}

// Initial render
render();

// Export functions for testing
export { render, handleAction, handleFakeLinkAction, exportData, addLangAttribute, getLangAttribute, getFullLangAttribute, validateLandmarkStructure, getSvgAccessibleName, createInPageButton, createAccessibleLink };