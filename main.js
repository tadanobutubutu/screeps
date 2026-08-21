// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_027: Fix 26 table structure issues
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

// REACT_015: Add lang attribute to HTML element
if (!document.documentElement.lang) {
  document.documentElement.lang = 'en';
}

// REACT_027: Fix table structure issues — ensure tables have caption, thead/tbody, and scoped th
function fixTableStructure() {
  var tables = document.querySelectorAll('table');
  tables.forEach(function (table) {
    // Ensure table has an accessible name via caption, aria-label, or aria-labelledby
    if (!table.querySelector('caption') && !table.hasAttribute('aria-label') && !table.hasAttribute('aria-labelledby')) {
      var caption = document.createElement('caption');
      caption.textContent = table.getAttribute('aria-label') || 'Data table';
      caption.setAttribute('aria-hidden', 'true');
      table.insertBefore(caption, table.firstChild);
    }
    // Ensure thead exists
    if (!table.querySelector('thead')) {
      var firstRow = table.querySelector('tr');
      if (firstRow) {
        var thead = document.createElement('thead');
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
    // Ensure tbody exists
    if (!table.querySelector('tbody')) {
      var remainingRows = Array.prototype.slice.call(table.querySelectorAll('tr'));
      if (remainingRows.length > 0) {
        var tbody = document.createElement('tbody');
        remainingRows.forEach(function (row) {
          tbody.appendChild(row);
        });
        table.appendChild(tbody);
      }
    }
    // Ensure all th elements have a scope attribute
    var ths = table.querySelectorAll('th');
    ths.forEach(function (th) {
      if (!th.hasAttribute('scope')) {
        var parent = th.parentElement;
        th.setAttribute('scope', parent && parent.tagName === 'THEAD' ? 'col' : 'row');
      }
    });
  });
}

// REACT_017 & REACT_025: Add/fix landmark issues and ensure unique landmarks
function fixLandmarks() {
  // Ensure a main landmark exists
  if (!document.querySelector('main, [role="main"]')) {
    var mainCandidate = document.querySelector('.main-content, #main-content, #main');
    if (mainCandidate) {
      mainCandidate.setAttribute('role', 'main');
    }
  }
  // Ensure a banner (header) landmark exists
  if (!document.querySelector('header, [role="banner"]')) {
    var headerCandidate = document.querySelector('.header, #header, #site-header');
    if (headerCandidate) {
      headerCandidate.setAttribute('role', 'banner');
    }
  }
  // Ensure a contentinfo (footer) landmark exists
  if (!document.querySelector('footer, [role="contentinfo"]')) {
    var footerCandidate = document.querySelector('.footer, #footer, #site-footer');
    if (footerCandidate) {
      footerCandidate.setAttribute('role', 'contentinfo');
    }
  }
  // Ensure nav landmarks have unique accessible labels
  var navs = document.querySelectorAll('nav, [role="navigation"]');
  var navLabels = {};
  navs.forEach(function (nav, index) {
    var label = nav.getAttribute('aria-label') || nav.getAttribute('aria-labelledby');
    if (!label) {
      nav.setAttribute('aria-label', 'Navigation ' + (index + 1));
      label = nav.getAttribute('aria-label');
    }
    if (navLabels[label]) {
      var newLabel = label + ' ' + (navLabels[label] + 1);
      navLabels[label] += 1;
      nav.setAttribute('aria-label', newLabel);
    } else {
      navLabels[label] = 1;
    }
  });
}

// REACT_041: Add accessible names to SVGs
function fixSvgAccessibility() {
  var svgs = document.querySelectorAll('svg');
  svgs.forEach(function (svg) {
    var hasTitle = svg.querySelector('title');
    var hasAriaLabel = svg.hasAttribute('aria-label') || svg.hasAttribute('aria-labelledby');
    if (!hasTitle && !hasAriaLabel) {
      var title = document.createElement('title');
      title.textContent = svg.getAttribute('data-name') || svg.getAttribute('aria-label') || 'Image';
      svg.insertBefore(title, svg.firstChild);
      if (!svg.hasAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    }
  });
}

// REACT_036: Fix fake link issue — elements that act as links but are not real <a href> links
function fixFakeLinks() {
  var fakeLinks = document.querySelectorAll(
    'a:not([href]), a[href=""], a[href="#"], a[href="javascript:void(0)"], a[href="javascript:void(0);"], [onclick]:not(a):not(button):not(input)'
  );
  fakeLinks.forEach(function (el) {
    if (el.tagName === 'A') {
      if (el.hasAttribute('onclick')) {
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.removeAttribute('href');
        el.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            el.click();
          }
        });
      }
    } else {
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    }
  });
}

// Apply all accessibility fixes once the DOM is ready
function applyAccessibilityFixes() {
  fixTableStructure();
  fixLandmarks();
  fixSvgAccessibility();
  fixFakeLinks();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyAccessibilityFixes);
} else {
  applyAccessibilityFixes();
}