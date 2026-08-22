(function() {
  'use strict';

  // ============================================================
  // Runtime DOM Fixes (from HEAD)
  // ============================================================

  function getMainElement() {
    var mainElement = document.querySelector('main') || 
                      document.querySelector('[role="main"]') ||
                      document.querySelector('#main') ||
                      document.querySelector('.main');
    if (!mainElement) {
      mainElement = document.getElementById('content') ||
                    document.getElementById('main-content') ||
                    document.querySelector('#root > main') ||
                    document.querySelector('#root > div');
    }
    if (!mainElement) {
      mainElement = document.querySelector('.content') || 
                    document.querySelector('.main-content') ||
                    document.querySelector('[class*="main"]');
    }
    return mainElement;
  }

  function fixLanguageAttribute() {
    var html = document.documentElement;
    if (html && !html.lang) {
      html.lang = 'en';
    }
  }

  function fixLandmarkIssues() {
    var main = getMainElement();
    if (main && !main.id) {
      main.id = 'main-content';
    }
    if (main && !main.getAttribute('aria-label')) {
      main.setAttribute('aria-label', 'Main content');
    }
    
    var landmarks = document.querySelectorAll('[role="main"]');
    landmarks.forEach(function(landmark, index) {
      if (index > 0 && !landmark.id) {
        landmark.id = 'main-content-' + index;
      }
    });
  }

  function fixTableStructure() {
    var tables = document.querySelectorAll('table');
    tables.forEach(function(table) {
      var hasHeader = table.querySelector('th') !== null;
      var hasCaption = table.querySelector('caption') !== null;
      
      if (hasHeader && !hasCaption) {
        var caption = document.createElement('caption');
        caption.textContent = 'Table';
        caption.style.captionSide = 'top';
        if (table.firstChild) {
          table.insertBefore(caption, table.firstChild);
        } else {
          table.appendChild(caption);
        }
      }
      
      if (!table.querySelector('thead') && hasHeader) {
        var firstRow = table.querySelector('tr');
        if (firstRow) {
          var thead = document.createElement('thead');
          thead.appendChild(firstRow.cloneNode(true));
          table.insertBefore(thead, firstRow);
          firstRow.parentNode.removeChild(firstRow);
        }
      }
      
      if (!table.querySelector('tbody')) {
        var rows = Array.from(table.querySelectorAll('tr'));
        var theadRow = table.querySelector('thead tr');
        if (theadRow) {
          rows = rows.filter(function(row) { return row !== theadRow; });
        }
        if (rows.length > 0) {
          var tbody = document.createElement('tbody');
          rows.forEach(function(row) { tbody.appendChild(row); });
          table.appendChild(tbody);
        }
      }
    });
  }

  function fixSvgAccessibility() {
    var svgs = document.querySelectorAll('svg');
    svgs.forEach(function(svg) {
      var hasAriaLabel = svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby');
      var hasTitleChild = svg.querySelector('title') !== null;
      if (!hasAriaLabel && !hasTitleChild) {
        var title = document.createElement('title');
        title.textContent = 'Icon';
        title.id = 'svg-title-' + Math.random().toString(36).substr(2, 9);
        svg.insertBefore(title, svg.firstChild);
        svg.setAttribute('aria-labelledby', title.id);
      }
    });
  }

  function fixFakeLinkIssue() {
    var fakeLinks = document.querySelectorAll('div[href="#"], span[href="#"], a[href="#"]');
    Array.prototype.forEach.call(fakeLinks, function(link) {
      if (link.tagName !== 'A' && link.tagName !== 'BUTTON') {
        var href = link.getAttribute('href');
        if (href && href !== '#') {
          link.setAttribute('role', 'link');
          link.setAttribute('tabindex', '0');
        }
      }
    });
  }

  function fixDuplicateMainElements() {
    var mainElements = document.querySelectorAll('main');
    if (mainElements.length > 1) {
      for (var i = 1; i < mainElements.length; i++) {
        mainElements[i].parentNode.removeChild(mainElements[i]);
      }
    }
  }

  // ============================================================
  // Rendering Utilities (from origin/main)
  // ============================================================

  function renderAccessibleSVG(accessibleName, svgId) {
    return '<svg aria-label="' + accessibleName + '" id="' + (svgId || '') + '"></svg>';
  }

  function renderLandmarkStructure(content) {
    return (
      '<main aria-label="Main content">' +
        '<header role="banner">' +
          '<nav role="navigation" aria-label="Main navigation"><!-- Navigation content --></nav>' +
        '</header>' +
        content +
        '<footer role="contentinfo"><!-- Footer content --></footer>' +
      '</main>'
    );
  }

  function createAccessibleButton(label, onClick, type) {
    var btn = document.createElement('button');
    btn.type = type || 'button';
    btn.setAttribute('aria-label', label);
    if (onClick) btn.addEventListener('click', onClick);
    return btn;
  }

  function renderAccessibleTable(headers, rows, caption) {
    var html = '<table>';
    if (caption) html += '<caption>' + caption + '</caption>';
    html += '<thead><tr>';
    headers.forEach(function(h) { html += '<th>' + h + '</th>'; });
    html += '</tr></thead><tbody>';
    rows.forEach(function(row) {
      html += '<tr>';
      row.forEach(function(cell) { html += '<td>' + cell + '</td>'; });
      html += '</tr>';
    });
    html += '</tbody></table>';
    return html;
  }

  function setDocumentTitleAndSectionsAriaLabels() {
    document.title = "Screeps Bot - Main";
    Array.from(document.querySelectorAll("section")).forEach(function(section) {
      if (!section.getAttribute("aria-label")) {
        section.setAttribute("aria-label", section.getAttribute("id") || "Unnamed section");
      }
    });
  }

  function renderApp() {
    var appContent = document.getElementById('app');
    if (appContent) {
      appContent.innerHTML = renderLandmarkStructure(
        '<h1>Welcome</h1>' +
        renderAccessibleSVG('Decorative circle icon', 'icon-1') +
        '<button type="button" aria-label="Click me">Click me</button>'
      );
      setDocumentTitleAndSectionsAriaLabels();
    }
  }

  // ============================================================
  // Initialization
  // ============================================================

  function init() {
    fixLanguageAttribute();
    fixLandmarkIssues();
    fixTableStructure();
    fixSvgAccessibility();
    fixFakeLinkIssue();
    fixDuplicateMainElements();
    setDocumentTitleAndSectionsAriaLabels();
  }

  // Export for module usage
  var exports = { 
    init: init,
    getMainElement: getMainElement,
    fixLanguageAttribute: fixLanguageAttribute,
    fixLandmarkIssues: fixLandmarkIssues,
    fixSvgAccessibility: fixSvgAccessibility,
    fixFakeLinkIssue: fixFakeLinkIssue,
    fixTableStructure: fixTableStructure,
    fixDuplicateMainElements: fixDuplicateMainElements,
    renderAccessibleSVG: renderAccessibleSVG,
    renderLandmarkStructure: renderLandmarkStructure,
    createAccessibleButton: createAccessibleButton,
    renderAccessibleTable: renderAccessibleTable,
    renderApp: renderApp,
    setDocumentTitleAndSectionsAriaLabels: setDocumentTitleAndSectionsAriaLabels
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
  }

  // Auto-initialize when DOM is ready
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  // Support ES module export
  if (typeof exports !== 'undefined') {
    Object.keys(exports).forEach(function(key) {
      try { exports[key] = exports[key]; } catch (e) {}
    });
  }
})();

// Blank export for ES module compatibility
export {};