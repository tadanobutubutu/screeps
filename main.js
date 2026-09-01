// TODO: This is the existing code that needs to be preserved
// Additional changes that need to be preserved

module.exports = {
  myFunction: function () {
    // Existing implementation
  },
  getLangAttribute: function() {
    // Implementation to handle REACT_015
  },
  personName: function() {
    // Implementation to handle REACT_015
  },
  validateTableAccessibility: function() {
    // Implementation to handle REACT_027
  },
  validateTableStructure: function() {
    // Implementation to handle REACT_027
  },
  validateLandmark: function() {
    // Implementation to handle REACT_017
  },
  validateLandmarkStructure: function() {
    // Implementation to handle REACT_017
  },
  newFocusTrap: function() {
    // Implementation to handle REACT_017 and NEW
  },
  getSvgAccessibleName: function() {
    // Implementation to handle REACT_041
  },
  createInPageButton: function() {
    // Implementation to handle REACT_036
  },
  addressAccessibilityIssues: function () {
    // New function to address accessibility issues
  },
  newFunction: function () {
    // New function implementation
  },
  fixTableStructureIssues: function(document) {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      // Ensure tables have proper structure
      if (!table.querySelector('thead') && table.querySelector('tr')) {
        const firstRow = table.querySelector('tr');
        const ths = firstRow.querySelectorAll('th');
        if (ths.length > 0) {
          const thead = document.createElement('thead');
          thead.appendChild(firstRow.cloneNode(true));
          table.insertBefore(thead, table.firstChild);
          firstRow.remove();
        }
      }

      // Ensure tables have tbody
      if (!table.querySelector('tbody')) {
        const rows = Array.from(table.querySelectorAll('tr'));
        const tbody = document.createElement('tbody');
        rows.forEach(row => tbody.appendChild(row));
        const thead = table.querySelector('thead');
        if (thead) {
          table.insertBefore(tbody, thead.nextSibling);
        } else {
          table.insertBefore(tbody, table.firstChild);
        }
      }

      // Ensure proper caption if needed
      const caption = table.querySelector('caption');
      if (!caption) {
        const newCaption = document.createElement('caption');
        newCaption.textContent = 'Data table';
        newCaption.style.clip = 'rect(0 0 0 0)';
        newCaption.style.clipPath = 'inset(50%)';
        newCaption.style.height = '1px';
        newCaption.style.overflow = 'hidden';
        newCaption.style.whiteSpace = 'nowrap';
        newCaption.style.width = '1px';
        table.insertBefore(newCaption, table.firstChild);
      }
    });
    return tables.length;
  },
  addressAccessibilityIssues: function () {
    // New function to address accessibility issues
  },
  // TODO: This is the existing code that needs to be preserved
  // (This comment remains as-is)
  // TODO: Create or update the affected functions to be accessible
  newFunction: function () {
    // New function implementation
  },
  validateTableAccessibility: function(element) {
    if (!element) return false;
    // Prefer explicit role="table"; allow tables without explicit role if they contain <table>
    if (element.getAttribute('role') !== 'table') {
      const table = element.querySelector('table');
      if (table) return true;
    }
    return true;
  },
  validateTableStructure: function(element) {
    if (!element) return false;
    const rows = element.querySelectorAll('tr');
    return rows.length > 0;
  },
  validateLandmark: function(element) {
    if (!element) return false;
    // Landmarks are expected to be SVG elements
    return element.tagName === 'SVG';
  },
  validateLandmarkStructure: function(element) {
    if (!element) return false;
    return element.id || element.getAttribute('aria-label');
  },
  ensureUniqueLandmarksArray: function(landmarks) {
    if (!Array.isArray(landmarks)) return [];
    const seen = new Set();
    const result = [];
    for (const lm of landmarks) {
      const id = lm.id || 'unknown';
      if (seen.has(id)) {
        // Generate a unique ID by appending a timestamp
        lm.id = `${id}-${Date.now()}`;
      }
      seen.add(id);
      result.push(lm);
    }
    return result;
  },
  getSvgAccessibleName: function(svgElement) {
    if (!svgElement) return '';
    const ariaLabel = svgElement.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    const title = svgElement.getAttribute('title');
    if (title) return title;
    return svgElement.tagName.toLowerCase();
  },
  addAccessibleNamesToSvg: function(svgElement, names) {
    const targetNames = Array.isArray(names) ? names : [names];
    for (let i = 0; i < svgElement.children.length; i++) {
      const child = svgElement.children[i];
      if (child.nodeType === Node.ELEMENT_NODE) {
        if (child.getAttribute('role') === 'img' || child.type === 'image') {
          if (!child.getAttribute('aria-label') && targetNames.length > 0) {
            addAriaLabel(child, targetNames[0]);
          }
        }
      }
    }
  },
  ensureElementHasId: function(element) {
    if (!element) {
      throw new Error('Element is required');
    }
    if (!element.id) {
      element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    return element.id;
  },
  addAriaLabel: function(element, label) {
    if (!element) {
      throw new Error('Element is required');
    }
    element.setAttribute('aria-label', label);
    return element;
  },
  renderDependencyGraph: function(data, container) {
    if (!data) {
      throw new Error('Dependency data is required');
    }
    if (!container) {
      throw new Error('Container element is required');
    }
    // Implementation would go here
    return container;
  },
  generateAccessibilityReport: function(issues) {
    if (!Array.isArray(issues)) {
      throw new Error('Issues must be an array');
    }

    const report = {
      totalIssues: issues.length,
      severityCounts: {
        critical: 0,
        serious: 0,
        moderate: 0,
        minor: 0
      },
      issuesByType: {},
      issues: []
    };

    issues.forEach(issue => {
      if (!issue || typeof issue !== 'object') {
        return;
      }

      const severity = issue.severity || 'minor';
      if (report.severityCounts[severity] !== undefined) {
        report.severityCounts[severity]++;
      } else {
        report.severityCounts.minor++;
      }

      const type = issue.type || 'other';
      if (!report.issuesByType[type]) {
        report.issuesByType[type] = 0;
      }
      report.issuesByType[type]++;

      report.issues.push({
        type: type,
        severity: severity,
        message: issue.message || '',
        element: issue.element || null
      });
    });

    report.summary = `Found ${report.totalIssues} accessibility issue(s): ` +
      `${report.severityCounts.critical} critical, ` +
      `${report.severityCounts.serious} serious, ` +
      `${report.severityCounts.moderate} moderate, ` +
      `${report.severityCounts.minor} minor.`;

    return report;
  },
  // REACT_027: Fix table structure issues
  fixTableStructureIssues(document) {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      const tables = document.querySelectorAll('table');
      tables.forEach(table => {
        // Ensure tables have proper structure
        if (!table.querySelector('thead') && table.querySelector('tr')) {
          const firstRow = table.querySelector('tr');
          const ths = firstRow.querySelectorAll('th');
          if (ths.length > 0) {
            const thead = document.createElement('thead');
            thead.appendChild(firstRow.cloneNode(true));
            table.insertBefore(thead, table.firstChild);
            firstRow.remove();
          }
        }

        // Ensure tables have tbody
        if (!table.querySelector('tbody')) {
          const rows = Array.from(table.querySelectorAll('tr'));
          const tbody = document.createElement('tbody');
          rows.forEach(row => tbody.appendChild(row));
          const thead = table.querySelector('thead');
          if (thead) {
            table.insertBefore(tbody, thead.nextSibling);
          } else {
            table.insertBefore(tbody, table.firstChild);
          }
        }

        // Ensure proper caption if needed
        const caption = table.querySelector('caption');
        if (!caption) {
          const newCaption = document.createElement('caption');
          newCaption.textContent = 'Data table';
          newCaption.style.clip = 'rect(0 0 0 0)';
          newCaption.style.clipPath = 'inset(50%)';
          newCaption.style.height = '1px';
          newCaption.style.overflow = 'hidden';
          newCaption.style.whiteSpace = 'nowrap';
          newCaption.style.width = '1px';
          table.insertBefore(newCaption, table.firstChild);
        }
      });
    });
    return tables.length;
  },
  addMainLandmark: function(document) {
    const mainElements = document.querySelectorAll('main');

    if (mainElements.length === 0) {
      // Find the main content area and wrap it with <main>
      const body = document.body;
      const main = document.createElement('main');
      main.setAttribute('role', 'main');

      // Move all body children into main
      while (body.firstChild) {
        main.appendChild(body.firstChild);
      }
      body.appendChild(main);
    } else if (mainElements.length === 1) {
      const main = mainElements[0];
      if (!main.hasAttribute('role')) {
        main.setAttribute('role', 'main');
      }
    }

    return document.querySelectorAll('main').length;
  },
  addSvgAccessibleNames: function(document) {
    const svgs = document.querySelectorAll('svg');
    let count = 0;

    svgs.forEach((svg, index) => {
      const existingLabel = svg.getAttribute('aria-label') ||
                            svg.querySelector('title') ||
                            svg.getAttribute('aria-labelledby');

      if (!existingLabel) {
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = `Icon ${index + 1}`;
        svg.insertBefore(title, svg.firstChild);

        const titleId = `svg-title-${index + 1}`;
        title.setAttribute('id', titleId);
        svg.setAttribute('aria-labelledby', titleId);
        count++;
      }
    });

    return count;
  },
  ensureUniqueLandmarks: function(document) {
    // Ensure only one main landmark
    const mains = document.querySelectorAll('main, [role="main"]');

    if (mains.length > 1) {
      // Keep the first main, remove role="main" from others or convert them
      for (let i = 1; i < mains.length; i++) {
        const main = mains[i];
        if (main.tagName === 'MAIN') {
          main.setAttribute('role', 'presentation');
        } else {
          main.removeAttribute('role');
          main.setAttribute('role', 'region');
        }
      }
    }

    // Ensure unique IDs for landmarks with labels
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="contentinfo"]');
    const seenIds = new Set();

    landmarks.forEach(landmark => {
      const id = landmark.id;
      if (id) {
        if (seenIds.has(id)) {
          landmark.id = `${id}-unique-${Math.random().toString(36).substr(2, 9)}`;
        }
        seenIds.add(id);
      }
    });

    return mains.length;
  },
  fixFakeLinkIssue: function(document) {
    // Find elements that look like links but aren't <a> tags
    const clickableElements = document.querySelectorAll('[role="link"]:not(a), [onclick]');
    let count = 0;

    clickableElements.forEach(element => {
      const tagName = element.tagName.toLowerCase();
      const hasHref = element.hasAttribute('href');

      if (tagName !== 'a' && !hasHref) {
        // Check if it should be a real link
        const isInteractive = element.getAttribute('role') === 'link' ||
                              (element.hasAttribute('onclick') && element.onclick.toString().includes('window.location'));

        if (isInteractive && !element.hasAttribute('aria-label')) {
          // Add accessible name
          const text = element.textContent.trim();
          if (text) {
            element.setAttribute('aria-label', text);
          }
        }
        count++;
      }
    });

    return count;
  },
  checkLinkAndButtonAccessibility: function(document) {
    const links = document.querySelectorAll('a, button, [role="button"]');
    const issues = {
      linksWithoutText: [],
      buttonsWithoutText: [],
      linksWithoutAriaLabel: [],
      buttonsWithoutAriaLabel: []
    };

    links.forEach(element => {
      const tagName = element.tagName.toLowerCase();
      const isLink = tagName === 'a';
      const isButton = tagName === 'button' || element.getAttribute('role') === 'button';

      if (isLink || isButton) {
        // Check for accessible text (text content or aria-label or title)
        const hasTextContent = element.textContent.trim().length > 0;
        const hasAriaLabel = element.hasAttribute('aria-label');
        const hasTitle = element.hasAttribute('title');

        const accessibleName = hasTextContent || hasAriaLabel || hasTitle;

        if (!accessibleName) {
          if (isLink) {
            issues.linksWithoutText.push(element);
          } else {
            issues.buttonsWithoutText.push(element);
          }
        }

        if (!hasAriaLabel && !(hasTextContent || hasTitle)) {
          if (isLink) {
            issues.linksWithoutAriaLabel.push(element);
          } else {
            issues.buttonsWithoutAriaLabel.push(element);
          }
        }
      }
    });

    return issues;
  },
  newFocusTrap: function(container) {
    if (!container) {
      return {
        activate: () => {},
        deactivate: () => {},
        toggle: () => {}
      };
    }

    let isActive = false;
    let previouslyFocusedElement = null;

    function getFocusableElements(element) {
      const getFocusableSelectors = [
        'a[href]',
        'area[href]',
        'input:not([disabled]):not([type="hidden"])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'button:not([disabled])',
        'iframe',
        'object',
        'embed',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]:not([contenteditable="false"])'
      ].join(', ');

      return Array.from(element.querySelectorAll(getFocusableSelectors))
        .filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0);
    }

    function handleKeyDown(event) {
      if (event.key === 'Tab') {
        const focusableElements = getFocusableElements(container);

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      } else if (event.key === 'Escape') {
        deactivate();
      }
    }

    function activate() {
      if (isActive) return;

      previouslyFocusedElement = document.activeElement;
      container.setAttribute('data-focus-trap-active', 'true');

      const focusableElements = getFocusableElements(container);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }

      container.addEventListener('keydown', handleKeyDown);
      isActive = true;
    }

    function deactivate() {
      if (!isActive) return;

      container.removeAttribute('data-focus-trap-active');
      container.removeEventListener('keydown', handleKeyDown);

      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
      }

      isActive = false;
    }

    function toggle() {
      if (isActive) {
        deactivate();
      } else {
        activate();
      }
    }

    return { activate, deactivate, toggle };
  },
  addLangAttribute: function(document, lang = 'en') {
    const htmlElement = document.documentElement;
    if (!htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', lang);
      return 1;
    }
    return 0;
  },
  fixTableStructure: function() {
    // Validate and fix table structure for accessibility
    const tables = document.querySelectorAll('table');

    tables.forEach(table => {
      // Check for missing headers
      const hasHeaderCells = table.querySelectorAll('th').length > 0;
      if (!hasHeaderCells) {
        console.warn('Table missing header cells (th).', table);
        // Attempt to fix: convert first row cells to th if they seem like headers
        const firstRow = table.querySelector('tr');
        if (firstRow && firstRow.children.length > 0) {
          // Only if not already th
          if (!firstRow.querySelector('th')) {
            const cells = firstRow.children;
            for (let i = 0; i < cells.length; i++) {
              const newTh = document.createElement('th');
              newTh.textContent = cells[i].textContent;
              newTh.setAttribute('scope', 'col');
              cells[i].replaceWith(newTh);
            }
            // Wrap first row in thead if not already
            if (!table.querySelector('thead')) {
              const thead = document.createElement('thead');
              firstRow.parentNode.insertBefore(thead, firstRow);
              thead.appendChild(firstRow);
            }
          }
        }
      }

      // Ensure proper use of thead and tbody
      const rows = Array.from(table.rows);
      const firstRow = rows[0];
      if (firstRow && firstRow.querySelector('th') && !table.querySelector('thead')) {
        const thead = document.createElement('thead');
        table.insertBefore(thead, firstRow);
        thead.appendChild(firstRow);
      }

      // Add scope attributes to th elements
      const thElements = table.querySelectorAll('th');
      thElements.forEach(th => {
        if (!th.hasAttribute('scope')) {
          // Determine appropriate scope
          const parent = th.parentElement;
          if (parent && parent.tagName === 'TR') {
            const grandparent = parent.parentElement;
            if (grandparent && grandparent.tagName === 'THEAD') {
              th.setAttribute('scope', 'col');
            } else if (th.tagName === 'TH') {
              // If it's in a row that is itself a header row (like in tbody for row headers)
              th.setAttribute('scope', 'row');
            } else {
              th.setAttribute('scope', 'col');
            }
          }
        }
      });

      // Ensure table has an accessible name (caption or aria-label)
      if (!table.querySelector('caption') && !table.hasAttribute('aria-label') && !table.hasAttribute('aria-labelledby')) {
        // Optionally add a caption if we can infer one, but for now just warn
        console.warn('Table missing accessible name (caption or aria-label).', table);
      }
    });
  },
  applyAccessibilityFixes: function(document, options = {}) {
    const lang = options.lang || 'en';

    return {
      langAdded: addLangAttribute(document, lang),
      tablesFixed: fixTableStructureIssues(document),
      mainsAdded: addMainLandmark(document),
      svgsFixed: addSvgAccessibleNames(document),
      landmarksEnsured: ensureUniqueLandmarks(document),
      linksFixed: fixFakeLinkIssue(document)
    };
  },
  handleCredentialResponse: async function(response) {
    // Implement the logic to handle the credential response
    // This function should be called when a credential response is received
    // For example, you might parse the response, validate it, and then store or use the credentials
    
    try {
      // Check if response is ok
      if (response.ok) {
        console.log('Handling credential response:', response);
        
        // Try to parse JSON response
        const json = await response.json();
        
        // If credentials are present in the response, set them
        if (json && typeof json === 'object' && 'credentials' in json) {
          const credentials = json.credentials;
          if (Array.isArray(credentials)) {
            // Set cookies based on credentials
            Object.entries(credentials).forEach(([key, value]) => {
              if (value) {
                document.cookie = `${key}=${value}; path=/`;
              }
            });
          }
        }
      } else {
        console.warn('Credential response is not OK:', response.status);
      }
    } catch (error) {
      console.error('Error handling credential response:', error);
    }
  },
  loop: () => {
    // Main game loop
  },
  add: function (a, b) {
    return a + b;
  },
  subtract: function (a, b) {
    return a - b;
  },
  multiply: function (a, b) {
    return a * b;
  },
  divide: function (a, b) {
    if (b === 0) {
      throw new Error('Division by zero');
    }
    return a / b;
  },
  fixTableStructureIssues: function(document) {
    // Validate and fix table structure for accessibility
    const tables = document.querySelectorAll('table');

    tables.forEach(table => {
      // Check for missing headers
      const hasHeaderCells = table.querySelectorAll('th').length > 0;
      if (!hasHeaderCells) {
        console.warn('Table missing header cells (th).', table);
        // Attempt to fix: convert first row cells to th if they seem like headers
        const firstRow = table.querySelector('tr');
        if (firstRow && firstRow.children.length > 0) {
          // Only if not already th
          if (!firstRow.querySelector('th')) {
            const cells = firstRow.children;
            for (let i = 0; i < cells.length; i++) {
              const newTh = document.createElement('th');
              newTh.textContent = cells[i].textContent;
              newTh.setAttribute('scope', 'col');
              cells[i].replaceWith(newTh);
            }
            // Wrap first row in thead if not already
            if (!table.querySelector('thead')) {
              const thead = document.createElement('thead');
              firstRow.parentNode.insertBefore(thead, firstRow);
              thead.appendChild(firstRow);
            }
          }
        }
      }

      // Ensure proper use of thead and tbody
      const rows = Array.from(table.rows);
      const firstRow = rows[0];
      if (firstRow && firstRow.querySelector('th') && !table.querySelector('thead')) {
        const thead = document.createElement('thead');
        table.insertBefore(thead, firstRow);
        thead.appendChild(firstRow);
      }

      // Add scope attributes to th elements
      const thElements = table.querySelectorAll('th');
      thElements.forEach(th => {
        if (!th.hasAttribute('scope')) {
          // Determine appropriate scope
          const parent = th.parentElement;
          if (parent && parent.tagName === 'TR') {
            const grandparent = parent.parentElement;
            if (grandparent && grandparent.tagName === 'THEAD') {
              th.setAttribute('scope', 'col');
            } else if (th.tagName === 'TH') {
              // If it's in a row that is itself a header row (like in tbody for row headers)
              th.setAttribute('scope', 'row');
            } else {
              th.setAttribute('scope', 'col');
            }
          }
        }
      });

      // Ensure table has an accessible name (caption or aria-label)
      if (!table.querySelector('caption') && !table.hasAttribute('aria-label') && !table.hasAttribute('aria-labelledby')) {
        // Optionally add a caption if we can infer one, but for now just warn
        console.warn('Table missing accessible name (caption or aria-label).', table);
      }
    });
  },
  addressAccessibilityIssues: function () {
    // New function to address accessibility issues
  },
  newFunction: function () {
    // New function implementation
  },
  validateTableAccessibility: function(element) {
    if (!element) return false;
    // Prefer explicit role="table"; allow tables without explicit role if they contain <table>
    if (element.getAttribute('role') !== 'table') {
      const table = element.querySelector('table');
      if (table) return true;
    }
    return true;
  },
  validateTableStructure: function(element) {
    if (!element) return false;
    const rows = element.querySelectorAll('tr');
    return rows.length > 0;
  },
  validateLandmark: function(element) {
    if (!element) return false;
    // Landmarks are expected to be SVG elements
    return element.tagName === 'SVG';
  },
  validateLandmarkStructure: function(element) {
    if (!element) return false;
    return element.id || element.getAttribute('aria-label');
  },
  ensureUniqueLandmarksArray: function(landmarks) {
    if (!Array.isArray(landmarks)) return [];
    const seen = new Set();
    const result = [];
    for (const lm of landmarks) {
      const id = lm.id || 'unknown';
      if (seen.has(id)) {
        // Generate a unique ID by appending a timestamp
        lm.id = `${id}-${Date.now()}`;
      }
      seen.add(id);
      result.push(lm);
    }
    return result;
  },
  getSvgAccessibleName: function(svgElement) {
    if (!svgElement) return '';
    const ariaLabel = svgElement.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    const title = svgElement.getAttribute('title');
    if (title) return title;
    return svgElement.tagName.toLowerCase();
  },
  addAccessibleNamesToSvg: function(svgElement, names) {
    const targetNames = Array.isArray(names) ? names : [names];
    for (let i = 0; i < svgElement.children.length; i++) {
      const child = svgElement.children[i];
      if (child.nodeType === Node.ELEMENT_NODE) {
        if (child.getAttribute('role') === 'img' || child.type === 'image') {
          if (!child.getAttribute('aria-label') && targetNames.length > 0) {
            addAriaLabel(child, targetNames[0]);
          }
        }
      }
    }
  },
  ensureElementHasId: function(element) {
    if (!element) {
      throw new Error('Element is required');
    }
    if (!element.id) {
      element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    return element.id;
  },
  addAriaLabel: function(element, label) {
    if (!element) {
      throw new Error('Element is required');
    }
    element.setAttribute('aria-label', label);
    return element;
  },
  renderDependencyGraph: function(data, container) {
    if (!data) {
      throw new Error('Dependency data is required');
    }
    if (!container) {
      throw new Error('Container element is required');
    }
    // Implementation would go here
    return container;
  },
  generateAccessibilityReport: function(issues) {
    if (!Array.isArray(issues)) {
      throw new Error('Issues must be an array');
    }

    const report = {
      totalIssues: issues.length,
      severityCounts: {
        critical: 0,
        serious: 0,
        moderate: 0,
        minor: 0
      },
      issuesByType: {},
      issues: []
    };

    issues.forEach(issue => {
      if (!issue || typeof issue !== 'object') {
        return;
      }

      const severity = issue.severity || 'minor';
      if (report.severityCounts[severity] !== undefined) {
        report.severityCounts[severity]++;
      } else {
        report.severityCounts.minor++;
      }

      const type = issue.type || 'other';
      if (!report.issuesByType[type]) {
        report.issuesByType[type] = 0;
      }
      report.issuesByType[type]++;

      report.issues.push({
        type: type,
        severity: severity,
        message: issue.message || '',
        element: issue.element || null
      });
    });

    report.summary = `Found ${report.totalIssues} accessibility issue(s): ` +
      `${report.severityCounts.critical} critical, ` +
      `${report.severityCounts.serious} serious, ` +
      `${report.severityCounts.moderate} moderate, ` +
      `${report.severityCounts.minor} minor.`;

    return report;
  },
  newFocusTrap: function(container) {
    if (!container) {
      return {
        activate: () => {},
        deactivate: () => {},
        toggle: () => {}
      };
    }

    let isActive = false;
    let previouslyFocusedElement = null;

    function getFocusableElements(element) {
      const getFocusableSelectors = [
        'a[href]',
        'area[href]',
        'input:not([disabled]):not([type="hidden"])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'button:not([disabled])',
        'iframe',
        'object',
        'embed',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]:not([contenteditable="false"])'
      ].join(', ');

      return Array.from(element.querySelectorAll(getFocusableSelectors))
        .filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0);
    }

    function handleKeyDown(event) {
      if (event.key === 'Tab') {
        const focusableElements = getFocusableElements(container);

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      } else if (event.key === 'Escape') {
        deactivate();
      }
    }

    function activate() {
      if (isActive) return;

      previouslyFocusedElement = document.activeElement;