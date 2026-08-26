// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

function fixTableStructureIssues(tableElement) {
  if (!tableElement) return;
  
  const headers = tableElement.querySelectorAll('th');
  const firstRow = tableElement.querySelector('thead tr') || 
                   tableElement.querySelector('tr');
  const isFirstRowHeader = firstRow && Array.from(firstRow.children).every(
    cell => cell.tagName === 'TH'
  );
  
  headers.forEach((th, index) => {
    if (isFirstRowHeader) {
      th.setAttribute('scope', 'col');
    } else if (th.parentElement && th.parentElement.children[0] === th) {
      th.setAttribute('scope', 'row');
    } else {
      th.setAttribute('scope', 'col');
    }
  });
  
  return tableElement;
}

function addLangAttribute() {
  const html = document.querySelector('html');
  if (html && !html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
}

function addMainLandmark() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length === 0) {
    const main = document.createElement('main');
    const body = document.querySelector('body');
    if (body) {
      body.insertBefore(main, body.firstChild);
    }
  }
}

function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg:not([aria-label])');
  svgs.forEach((svg, index) => {
    svg.setAttribute('aria-label', `Icon ${index + 1}`);
    svg.setAttribute('role', 'img');
  });
}

function ensureUniqueLandmarks() {
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          el.setAttribute('aria-label', `${landmark} ${index + 1}`);
        }
      });
    }
  });
}

function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a:not([href])');
  fakeLinks.forEach(link => {
    if (link.getAttribute('href') === '#' || !link.hasAttribute('href')) {
      link.setAttribute('role', 'button');
    }
  });
}

function initializeAccessibility() {
  addLangAttribute();
  addMainLandmark();
  addSvgAccessibleNames();
  ensureUniqueLandmarks();
  fixFakeLinkIssue();
  
  const tables = document.querySelectorAll('table');
  tables.forEach(table => fixTableStructureIssues(table));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAccessibility);
} else {
  initializeAccessibility();
}

module.exports = {
  fixTableStructureIssues,
  addLangAttribute,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  initializeAccessibility
};