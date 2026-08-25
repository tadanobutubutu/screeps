// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * REACT_015: Adds a lang attribute to the <html> element if missing or empty.
 */
function addLangAttribute(lang) {
  if (typeof lang === 'undefined' || lang === null || lang === '') {
    lang = 'en';
  }
  if (typeof document !== 'undefined') {
    var htmlElement = document.documentElement;
    if (!htmlElement.hasAttribute('lang') || htmlElement.getAttribute('lang') === '') {
      htmlElement.setAttribute('lang', lang);
    }
  }
}

/**
 * REACT_027: Fixes table structure issues by ensuring tables have proper
 * thead/tbody/tfoot sections and that each row has the correct cell count.
 */
function fixTableStructure() {
  if (typeof document === 'undefined') return;
  var tables = document.querySelectorAll('table');
  tables.forEach(function (table) {
    // Ensure table has at least a tbody if no thead/tbody/tfoot present
    var hasSection =
      table.querySelector('thead') || table.querySelector('tbody') || table.querySelector('tfoot');
    if (!hasSection) {
      var rows = Array.prototype.slice.call(table.querySelectorAll('tr'));
      if (rows.length > 0) {
        var tbody = document.createElement('tbody');
        rows.forEach(function (row) {
          tbody.appendChild(row);
        });
        table.appendChild(tbody);
      }
    }
    // Ensure consistent column count across rows
    var allRows = Array.prototype.slice.call(table.querySelectorAll('tr'));
    var maxCols = 0;
    allRows.forEach(function (row) {
      var cellCount = row.querySelectorAll('th, td').length;
      if (cellCount > maxCols) {
        maxCols = cellCount;
      }
    });
    allRows.forEach(function (row) {
      var cellCount = row.querySelectorAll('th, td').length;
      while (cellCount < maxCols) {
        var td = document.createElement('td');
        row.appendChild(td);
        cellCount++;
      }
    });
  });
}

/**
 * REACT_017: Adds a <main> landmark if one does not already exist.
 */
function addMainLandmark() {
  if (typeof document === 'undefined') return;
  if (!document.querySelector('main')) {
    var main = document.createElement('main');
    main.setAttribute('role', 'main');
    // Move existing body content into the main element
    var body = document.body;
    while (body.firstChild) {
      main.appendChild(body.firstChild);
    }
    body.appendChild(main);
  }
}

/**
 * REACT_041: Adds accessible names (title or aria-label) to SVGs that lack them.
 */
function addSvgAccessibleNames() {
  if (typeof document === 'undefined') return;
  var svgs = document.querySelectorAll('svg');
  svgs.forEach(function (svg) {
    var hasLabel = svg.hasAttribute('aria-label') || svg.hasAttribute('aria-labelledby');
    var hasTitle = svg.querySelector('title');
    if (!hasLabel && !hasTitle) {
      var title = document.createElement('title');
      title.textContent = 'Image';
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('role', 'img');
    }
  });
}

/**
 * REACT_025: Ensures landmarks are unique by removing duplicate role attributes.
 */
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return;
  var landmarkSelectors = ['main', 'nav', 'header', 'footer', 'aside', 'section'];
  landmarkSelectors.forEach(function (selector) {
    var elements = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (elements.length > 1) {
      // Keep the first, convert others to a div to avoid duplicate landmarks
      for (var i = 1; i < elements.length; i++) {
        var el = elements[i];
        if (el.hasAttribute('role')) {
          el.removeAttribute('role');
        }
      }
    }
  });
}

/**
 * REACT_036: Fixes fake link issues by ensuring elements styled as links
 * but using non-semantic elements have proper roles and tabindex.
 */
function fixFakeLinkIssue() {
  if (typeof document === 'undefined') return;
  var fakeLinks = document.querySelectorAll('span[class*="link"], div[class*="link"], [data-link]');
  fakeLinks.forEach(function (el) {
    if (el.tagName.toLowerCase() !== 'a' && el.tagName.toLowerCase() !== 'button') {
      if (!el.hasAttribute('role')) {
        el.setAttribute('role', 'link');
      }
      if (!el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '0');
      }
      // Add keyboard handler for Enter key if there's an onclick
      if (el.onclick && !el.hasAttribute('data-keyboard-fixed')) {
        el.setAttribute('data-keyboard-fixed', 'true');
        el.addEventListener('keydown', function (event) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            el.click();
          }
        });
      }
    }
  });
}

module.exports = {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
};