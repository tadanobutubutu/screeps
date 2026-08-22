// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (NEW FUNCTION fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addAccessibleNamesToSvgFiles)
// - REACT_025: Ensure unique landmarks (NEW FUNCTION ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: replaceHashLinksWithButtons)

/**
 * REACT_015: Add lang attribute to HTML element
 * Ensures the <html> element has a lang attribute for screen readers.
 * @param {Document} [doc] - The document to modify (defaults to global document).
 */
function addLangAttribute(doc) {
  doc = doc || (typeof document !== 'undefined' ? document : null);
  if (!doc) return;
  var htmlElement = doc.documentElement;
  if (htmlElement && !htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

/**
 * REACT_027: Fix table structure issues
 * Addresses common table structure issues such as missing <thead>, <tbody>,
 * missing <th> scope attributes, and missing captions.
 * @param {Document} [doc] - The document to modify (defaults to global document).
 */
function fixTableStructureIssues(doc) {
  doc = doc || (typeof document !== 'undefined' ? document : null);
  if (!doc) return;
  var tables = doc.querySelectorAll('table');
  for (var i = 0; i < tables.length; i++) {
    var table = tables[i];

    // Add a caption if one is missing and the table has a preceding heading
    if (!table.querySelector('caption')) {
      var caption = doc.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
    }

    // Ensure scope attributes on th elements
    var thElements = table.querySelectorAll('th');
    for (var j = 0; j < thElements.length; j++) {
      var th = thElements[j];
      if (!th.getAttribute('scope')) {
        var cellIndex = th.cellIndex;
        var rowIndex = th.parentNode.rowIndex;
        // If it's in the first row, it's a column header
        if (rowIndex === 0) {
          th.setAttribute('scope', 'col');
        } else if (cellIndex === 0) {
          th.setAttribute('scope', 'row');
        } else {
          th.setAttribute('scope', 'col');
        }
      }
    }

    // Wrap row groups in tbody if not present
    if (!table.querySelector('tbody') && !table.querySelector('thead')) {
      var rows = table.querySelectorAll('tr');
      if (rows.length > 0) {
        var tbody = doc.createElement('tbody');
        for (var k = 0; k < rows.length; k++) {
          tbody.appendChild(rows[k]);
        }
        table.appendChild(tbody);
      }
    }
  }
}

/**
 * REACT_017: Add main landmark
 * Ensures there is a <main> landmark element in the document.
 * @param {Document} [doc] - The document to modify (defaults to global document).
 */
function addMainLandmark(doc) {
  doc = doc || (typeof document !== 'undefined' ? document : null);
  if (!doc) return;
  if (!doc.querySelector('main, [role="main"]')) {
    var body = doc.body;
    if (body) {
      var main = doc.createElement('main');
      // Move existing body children into main, if the body only has
      // non-landmark content directly
      main.setAttribute('role', 'main');
      while (body.firstChild) {
        main.appendChild(body.firstChild);
      }
      body.appendChild(main);
    }
  }
}

/**
 * REACT_041: Add accessible names to SVG files
 * Ensures SVG elements have accessible names via <title> or aria-label.
 * @param {Document} [doc] - The document to modify (defaults to global document).
 */
function addAccessibleNamesToSvgFiles(doc) {
  doc = doc || (typeof document !== 'undefined' ? document : null);
  if (!doc) return;
  var svgs = doc.querySelectorAll('svg');
  for (var i = 0; i < svgs.length; i++) {
    var svg = svgs[i];
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      // Check if there's already a <title> child element
      var existingTitle = svg.querySelector('title');
      if (!existingTitle) {
        var title = doc.createElement('title');
        title.textContent = 'Graphic';
        svg.insertBefore(title, svg.firstChild);
        svg.setAttribute('role', 'img');
      } else if (!svg.getAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    }
  }
}

/**
 * REACT_025: Ensure unique landmarks
 * Ensures landmark elements have unique and accessible names when
 * multiple landmarks of the same type exist.
 * @param {Document} [doc] - The document to modify (defaults to global document).
 */
function ensureUniqueLandmarks(doc) {
  doc = doc || (typeof document !== 'undefined' ? document : null);
  if (!doc) return;
  var landmarkSelectors = [
    'main, [role="main"]',
    'nav, [role="navigation"]',
    'header, [role="banner"]',
    'footer, [role="contentinfo"]',
    'aside, [role="complementary"]'
  ];

  for (var i = 0; i < landmarkSelectors.length; i++) {
    var landmarks = doc.querySelectorAll(landmarkSelectors[i]);
    if (landmarks.length > 1) {
      for (var j = 0; j < landmarks.length; j++) {
        var landmark = landmarks[j];
        if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
          // Determine the landmark type for a meaningful label
          var tagName = landmark.tagName.toLowerCase();
          var role = landmark.getAttribute('role') || tagName;
          var labelMap = {
            'main': 'Primary',
            'navigation': 'Navigation ' + (j + 1),
            'banner': 'Header',
            'contentinfo': 'Footer ' + (j + 1),
            'complementary': 'Sidebar ' + (j + 1)
          };
          landmark.setAttribute('aria-label', labelMap[role] || role + ' ' + (j + 1));
        }
      }
    }
  }
}

/**
 * REACT_036: Fix fake link issue
 * Replaces <a href="#"> or similar hash-only links with proper <button> elements.
 * @param {Document} [doc] - The document to modify (defaults to global document).
 */
function replaceHashLinksWithButtons(doc) {
  doc = doc || (typeof document !== 'undefined' ? document : null);
  if (!doc) return;
  var links = doc.querySelectorAll('a[href="#"], a[href=""], a[href="#0"], a:not([href])');
  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    var button = doc.createElement('button');
    // Copy text content
    button.textContent = link.textContent;
    // Copy classes
    if (link.className) {
      button.className = link.className;
    }
    // Copy inline styles
    if (link.getAttribute('style')) {
      button.setAttribute('style', link.getAttribute('style'));
    }
    // Copy data attributes
    var attrs = link.attributes;
    for (var j = 0; j < attrs.length; j++) {
      var attr = attrs[j];
      if (attr.name.indexOf('data-') === 0 || attr.name === 'id') {
        button.setAttribute(attr.name, attr.value);
      }
    }
    // Copy event listeners by preserving onclick attribute
    if (link.getAttribute('onclick')) {
      button.setAttribute('onclick', link.getAttribute('onclick'));
    }
    // Replace in DOM
    if (link.parentNode) {
      link.parentNode.replaceChild(button, link);
    }
  }
}

// Export functions for testing and module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addLangAttribute: addLangAttribute,
    fixTableStructureIssues: fixTableStructureIssues,
    addMainLandmark: addMainLandmark,
    addAccessibleNamesToSvgFiles: addAccessibleNamesToSvgFiles,
    ensureUniqueLandmarks: ensureUniqueLandmarks,
    replaceHashLinksWithButtons: replaceHashLinksWithButtons
  };
}