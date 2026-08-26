module.exports = {
  getGreeting: function() {
    return 'Hello, World!';
  },
  // Add a new function to set the lang attribute on the HTML element
  setLangAttribute: function(lang) {
    document.documentElement.lang = lang;
  },
  // REACT_015: Add lang attribute to HTML element
  addLangAttribute: function(lang) {
    if (!lang) {
      lang = 'en';
    }
    document.documentElement.setAttribute('lang', lang);
    return document.documentElement.lang;
  },
  // REACT_027: Fix 26 table structure issues
  fixTableStructure: function() {
    const tables = document.querySelectorAll('table');
    let fixedCount = 0;
    tables.forEach(function(table) {
      // Ensure table has a caption
      if (!table.querySelector('caption')) {
        const caption = document.createElement('caption');
        caption.textContent = 'Data table';
        table.insertBefore(caption, table.firstChild);
        fixedCount++;
      }
      // Ensure table has a thead
      if (!table.querySelector('thead')) {
        const firstRow = table.querySelector('tr');
        if (firstRow) {
          const thead = document.createElement('thead');
          thead.appendChild(firstRow.cloneNode(true));
          table.insertBefore(thead, table.querySelector('tbody') || null);
          fixedCount++;
        }
      }
      // Ensure rows have th for header cells
      const headerRows = table.querySelectorAll('thead tr');
      headerRows.forEach(function(row) {
        const cells = row.querySelectorAll('td');
        cells.forEach(function(cell) {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          if (cell.getAttribute('scope')) {
            th.setAttribute('scope', cell.getAttribute('scope'));
          } else {
            th.setAttribute('scope', 'col');
          }
          cell.parentNode.replaceChild(th, cell);
          fixedCount++;
        });
      });
    });
    return fixedCount;
  },
  // REACT_017: Add main landmark
  addMainLandmark: function() {
    if (!document.querySelector('main')) {
      const main = document.createElement('main');
      const body = document.body;
      // Move body children (except script/style) into main
      const children = Array.from(body.children).filter(function(child) {
        return child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE';
      });
      children.forEach(function(child) {
        main.appendChild(child);
      });
      body.appendChild(main);
    }
    return document.querySelector('main');
  },
  // Validate landmark element
  validateLandmark: function(element) {
    if (!element) return false;
    const validLandmarks = ['main', 'nav', 'header', 'footer', 'aside', 'section', 'article'];
    const role = element.getAttribute('role') || element.tagName.toLowerCase();
    return validLandmarks.indexOf(role) !== -1;
  },
  // Validate unique landmarks
  validateUniqueLandmarks: function() {
    const landmarks = document.querySelectorAll('main, nav, header, footer, aside, [role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]');
    const seen = {};
    const duplicates = [];
    landmarks.forEach(function(landmark) {
      const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
      if (seen[role]) {
        duplicates.push(landmark);
      } else {
        seen[role] = true;
      }
    });
    return { isUnique: duplicates.length === 0, duplicates: duplicates };
  },
  // Validate landmark structure
  validateLandmarkStructure: function() {
    const issues = [];
    const mainElements = document.querySelectorAll('main, [role="main"]');
    if (mainElements.length === 0) {
      issues.push('No main landmark found');
    } else if (mainElements.length > 1) {
      issues.push('Multiple main landmarks found');
    }
    const navElements = document.querySelectorAll('nav, [role="navigation"]');
    navElements.forEach(function(nav) {
      if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
        issues.push('Nav landmark missing accessible name');
      }
    });
    return { isValid: issues.length === 0, issues: issues };
  },
  // REACT_041: Add accessible names to SVGs
  addSvgAccessibleNames: function() {
    const svgs = document.querySelectorAll('svg');
    let fixedCount = 0;
    svgs.forEach(function(svg) {
      if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
        const title = svg.querySelector('title');
        if (!title) {
          const newTitle = document.createElement('title');
          newTitle.textContent = 'Icon';
          svg.insertBefore(newTitle, svg.firstChild);
        }
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', 'Icon');
        fixedCount++;
      }
    });
    return fixedCount;
  },
  // Get accessible name for an SVG
  getSvgAccessibleName: function(svg) {
    if (!svg) return null;
    if (svg.getAttribute('aria-label')) {
      return svg.getAttribute('aria-label');
    }
    if (svg.getAttribute('aria-labelledby')) {
      return svg.getAttribute('aria-labelledby');
    }
    const title = svg.querySelector('title');
    if (title) {
      return title.textContent;
    }
    return null;
  },
  // Create accessibility props for an SVG
  createSvgAccessibilityProps: function(label) {
    return {
      role: 'img',
      'aria-label': label || 'Icon',
      focusable: false
    };
  },
  // REACT_025: Ensure unique landmarks
  ensureUniqueLandmarks: function() {
    const result = this.validateUniqueLandmarks();
    if (!result.isUnique) {
      result.duplicates.forEach(function(landmark, index) {
        if (index > 0) {
          landmark.setAttribute('aria-hidden', 'true');
        }
      });
    }
    return result;
  },
  // REACT_036: Fix fake link issue
  fixFakeLinkIssue: function() {
    const links = document.querySelectorAll('a');
    let fixedCount = 0;
    links.forEach(function(link) {
      if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
        // Convert to a button
        const button = document.createElement('button');
        button.textContent = link.textContent;
        button.className = link.className;
        if (link.getAttribute('onclick')) {
          button.setAttribute('onclick', link.getAttribute('onclick'));
        }
        link.parentNode.replaceChild(button, link);
        fixedCount++;
      }
    });
    return fixedCount;
  },
  // Validate link accessibility
  validateLinkAccessibility: function(link) {
    if (!link) return { isValid: false, issues: ['Link is null'] };
    const issues = [];
    if (!link.getAttribute('href')) {
      issues.push('Link missing href attribute');
    }
    if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
      issues.push('Link missing accessible name');
    }
    return { isValid: issues.length === 0, issues: issues };
  },
  // Create an in-page button
  createInPageButton: function(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.type = 'button';
    if (typeof onClick === 'function') {
      button.addEventListener('click', onClick);
    }
    return button;
  },
  // Validate link or button
  validateLinkOrButton: function(element) {
    if (!element) return { isValid: false, issues: ['Element is null'] };
    const issues = [];
    const tagName = element.tagName.toLowerCase();
    if (tagName !== 'a' && tagName !== 'button') {
      issues.push('Element is not a link or button');
    }
    if (tagName === 'a' && !element.getAttribute('href')) {
      issues.push('Anchor missing href');
    }
    if (!element.textContent.trim() && !element.getAttribute('aria-label')) {
      issues.push('Element missing accessible name');
    }
    return { isValid: issues.length === 0, issues: issues };
  },
  // Create an accessible link
  createAccessibleLink: function(href, text, ariaLabel) {
    const link = document.createElement('a');
    link.setAttribute('href', href);
    link.textContent = text;
    if (ariaLabel) {
      link.setAttribute('aria-label', ariaLabel);
    }
    return link;
  }
};