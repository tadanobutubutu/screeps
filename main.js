// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

// Assuming you have a button with ID 'myButton'
const button = document.getElementById('myButton');
button.setAttribute('aria-label', 'My Button');
button.setAttribute('role', 'button');
button.setAttribute('aria-expanded', 'false');

// New function to handle button click
function handleButtonClick() {
  const button = document.getElementById('myButton');
  const isExpanded = button.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
  button.setAttribute('aria-expanded', isExpanded);
}

// New function to ensure HTML lang attribute is set
function addLangAttribute() {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
}

// New function to inject and fix fake links
function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('div[role="link"], span[role="link"]');
  fakeLinks.forEach(fakeLink => {
    if (fakeLink.tagName === 'DIV' || fakeLink.tagName === 'SPAN') {
      const a = document.createElement('a');
      a.href = fakeLink.getAttribute('href') || '#';
      a.textContent = fakeLink.textContent;
      fakeLink.parentNode.replaceChild(a, fakeLink);
    }
  });
}

// Ensure Unique Landmarks Function
function ensureUniqueLandmarks() {
  const existingHeaders = Array.from(document.querySelectorAll('header[role="banner"]'));
  const existingFooters = Array.from(document.querySelectorAll('footer[role="contentinfo"]'));

  if (existingHeaders.length > 1) {
    existingHeaders.forEach((header, index) => index > 0 && header.remove());
  }
  if (existingFooters.length > 1) {
    existingFooters.forEach((footer, index) => index > 0 && footer.remove());
  }
}

// New function to inject primary content into main landmark
function wrapPrimaryContentInMain() {
  const existingMains = Array.from(document.querySelectorAll('main, [role="main"]'));

  // Remove duplicate main elements if any
  existingMains.forEach((main, index) => {
    if (index > 0) {
      main.remove();
    }
  });

  // If no main element exists, create and wrap primary content
  const mainElement = document.createElement('main');
  mainElement.setAttribute('role', 'main');

  // Find primary content container (adjust selector based on your content structure)
  const contentContainer = document.getElementById('content') || document.querySelector('.content') || document.body;

  // Move existing content into main if not already inside one
  if (!contentContainer.closest('main, [role="main"]')) {
    while (contentContainer.firstChild) {
      mainElement.appendChild(contentContainer.firstChild);
    }
    contentContainer.appendChild(mainElement);
  }
}

// Add function to add 'scope="col"' attribute to table header cells
function addScopeToTableHeaders() {
  const headers = document.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
}

// New function to process accessibility issues from insight report
function processAccessibilityIssues(insightReport) {
  // Process each issue from the insight report and address accordingly
  if (insightReport && insightReport.issues) {
    insightReport.issues.forEach(issue => {
      switch (issue.code) {
        case 'REACT_015':
          // Add lang attribute to HTML element
          addLangAttribute();
          break;
        case 'FAKE_LINKS':
          // Fix fake links
          fixFakeLinks();
          break;
        case 'UNIQUE_LANDMARKS':
          // Ensure unique landmarks
          ensureUniqueLandmarks();
          break;
        case 'LANDMARK_STRUCTURE':
          // Ensure proper landmark structure
          wrapPrimaryContentInMain();
          break;
        case 'ACCESSIBLE_SVGS':
          // Add accessible SVGs
          addAccessibleSVGs();
          break;
        case 'TABLE_HEADERS':
          // Add scope to table headers
          addScopeToTableHeaders();
          break;
        default:
          // Unknown issue type, ignore
          break;
      }
    });
  }

  // Run all accessibility fixes regardless of report content as fallback
  addLangAttribute();
  fixFakeLinks();
  ensureUniqueLandmarks();
  wrapPrimaryContentInMain();
  addAccessibleSVGs();
  addScopeToTableHeaders();
}

// New function to add accessible names to SVGs
function addAccessibleSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const title = document.createElement('title');
    title.textContent = 'Descriptive title for SVG';
    title.id = 'svg-title-' + Math.random().toString(36).substr(2, 9);
    svg.insertBefore(title, svg.firstChild);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-labelledby', title.id);
  });
}

// Call all necessary functions
addLangAttribute();
fixFakeLinks();
ensureUniqueLandmarks();
wrapPrimaryContentInMain();
addAccessibleSVGs();
addScopeToTableHeaders();

module.exports = {
  wrapPrimaryContentInMain,
  handleButtonClick,
  addLangAttribute,
  fixFakeLinks,
  ensureUniqueLandmarks,
  processAccessibilityIssues,
  addAccessibleSVGs,
  addScopeToTableHeaders,
};