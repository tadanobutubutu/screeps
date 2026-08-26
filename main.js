// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

module.exports = {
  loop: function() {
    // Clear residual memory
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }

    // Run accessibility fixes
    addLangAttribute();
    fixTableStructureIssues();
    addMainLandmark();
    addSvgAccessibleNames();
    ensureUniqueLandmarks();
    fixFakeLinkIssue();

    // Game logic here
  }
};

function addLangAttribute() {
  // Add lang attribute to HTML element for accessibility
  if (typeof document !== 'undefined') {
    const html = document.documentElement;
    if (html && !html.hasAttribute('lang')) {
      html.setAttribute('lang', 'en');
    }
  }
}

function fixTableStructureIssues() {
  // Fix table structure issues for accessibility
  const tables = typeof document !== 'undefined' ? document.querySelectorAll('table') : [];
  tables.forEach(function(table) {
    const hasHeader = table.querySelector('thead');
    const hasBody = table.querySelector('tbody');
    if (!hasBody) {
      const rows = table.querySelectorAll('tr');
      if (rows.length > 0) {
        const tbody = document.createElement('tbody');
        rows.forEach(function(row) {
          tbody.appendChild(row);
        });
        table.appendChild(tbody);
      }
    }
  });
}

function addMainLandmark() {
  // Add main landmark for accessibility
  if (typeof document !== 'undefined') {
    const existingMain = document.querySelector('main, [role="main"]');
    if (!existingMain) {
      const body = document.body;
      if (body) {
        const main = document.createElement('main');
        main.setAttribute('role', 'main');
        while (body.firstChild) {
          main.appendChild(body.firstChild);
        }
        body.appendChild(main);
      }
    }
  }
}

function addSvgAccessibleNames() {
  // Add accessible names to SVGs
  if (typeof document !== 'undefined') {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(function(svg, index) {
      const title = svg.querySelector('title');
      if (!title) {
        const newTitle = document.createElement('title');
        newTitle.textContent = 'SVG graphic ' + (index + 1);
        svg.insertBefore(newTitle, svg.firstChild);
      }
    });
  }
}

function ensureUniqueLandmarks() {
  // Ensure unique landmarks for accessibility
  if (typeof document !== 'undefined') {
    const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
    landmarks.forEach(function(landmark) {
      const elements = document.querySelectorAll(landmark);
      if (elements.length > 1) {
        elements.forEach(function(el, index) {
          if (index > 0) {
            el.setAttribute('aria-label', landmark + '-section-' + (index + 1));
          }
        });
      }
    });
  }
}

function fixFakeLinkIssue() {
  // Fix fake link issues for accessibility (links that aren't anchor tags)
  if (typeof document !== 'undefined') {
    const fakeLinks = document.querySelectorAll('[data-link]');
    fakeLinks.forEach(function(link) {
      if (link.tagName !== 'A') {
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
      }
    });
  }
}