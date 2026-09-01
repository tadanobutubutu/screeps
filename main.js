const main = require('./utilities');

const { createInPageButton, createWebResourceButton, validateLandmark, validateLandmarkStructure, validateAccessibilityReport } = require('./utilities');

const { addLangAttribute, fixTableStructureIssues, addMainLandmark, ensureUniqueLandmarks, setSvgAccessibilityProps, addAccessibleNamesToSVGs, addAccessibleNamesToSVGs, fixFakeLinkIssue, fixFakeLinkIssues, fixLandmarkIssues, addLandmarkRegions, uniqueLandmarks, fixImageAltTexts, googleSignIn, handleCredentialResponse, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex, addressAccessibilityIssues } = main;

const http = require('http');
const url = require('url');

// Function to validate table accessibility
const validateTableAccessibility = (html) => {
  const issues = [];

  // Check if HTML contains tables
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let match;

  while ((match = tableRegex.exec(html)) !== null) {
    const tableContent = match[0];
    const tableNumber = (html.slice(0, match.index).match(/<table/gi) || []).length + 1;

    // Check for caption
    const hasCaption = /<caption[^>]*>[\s\S]*?<\/caption>/i.test(tableContent);
    if (!hasCaption) {
      issues.push({
        type: 'table',
        severity: 'warning',
        message: `Table ${tableNumber} is missing a <caption> element for accessibility`,
        suggestion: 'Add a <caption> element immediately after the <table> tag to describe the purpose of the table'
      });
    }

    // Check for th elements
    const hasHeaders = /<th[^>]*>/i.test(tableContent);
    if (!hasHeaders) {
      issues.push({
        type: 'table',
        severity: 'warning',
        message: `Table ${tableNumber} appears to be a data table but has no <th> (table header) elements`,
        suggestion: 'Add <th> elements for column or row headers to improve accessibility for screen readers'
      });
    }

    // Check for scope attributes on th elements
    const thMatches = tableContent.match(/<th[^>]*>/gi) || [];
    thMatches.forEach((thTag, index) => {
      if (!/scope=["'](row|col|rowgroup|colgroup)["']/i.test(thTag)) {
        issues.push({
          type: 'table',
          severity: 'info',
          message: `Table ${tableNumber} header ${index + 1} is missing a 'scope' attribute`,
          suggestion: 'Add scope="col", scope="row", scope="rowgroup", or scope="colgroup" to <th> elements'
        });
      }
    });

    // Check for thead and tbody structure
    const hasThead = /<thead[^>]*>[\s\S]*?<\/thead>/i.test(tableContent);
    const hasTbody = /<tbody[^>]*>[\s\S]*?<\/tbody>/i.test(tableContent);

    if (!hasThead) {
      issues.push({
        type: 'table',
        severity: 'info',
        message: `Table ${tableNumber} is missing <thead> element`,
        suggestion: 'Wrap header rows in a <thead> element for better semantic structure'
      });
    }

    if (!hasTbody) {
      issues.push({
        type: 'table',
        severity: 'info',
        message: `Table ${tableNumber} is missing <tbody> element`,
        suggestion: 'Wrap data rows in a <tbody> element for better semantic structure'
      });
    }

    // Check for id and headers attributes for complex tables
    const hasMultipleHeaders = (tableContent.match(/<th/gi) || []).length > 1;
    if (hasMultipleHeaders) {
      const hasHeadersAttr = /headers=["'][^"']+["']/.test(tableContent);
      const hasIdAttr = /id=["'][^"']+["']/.test(tableContent.replace(/<th/gi, '<td'));

      if (!hasIdAttr && !hasHeadersAttr) {
        issues.push({
          type: 'table',
          severity: 'warning',
          message: `Table ${tableNumber} has multiple headers but may not have proper id/headers associations`,
          suggestion: 'For complex tables, ensure header cells have unique id attributes and data cells have headers attributes referencing those ids'
        });
      }
    }
  }

  return issues;
};

// Re-add the required exports for functionA and functionB
// Assuming that they are objects with properties X, Y, and Z
const { functionA, functionB } = require('./functionModule');

const a11yStore = {
  // ... existing methods ...
  prefersReducedMotion: function() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  prefersHighContrast: function() {
    return window.matchMedia('(prefers-contrast: more)').matches;
  },

  updateLiveRegion: function(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();
    this.announce(message, priority);
  },

  checkLandmarkElements: function() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((element) => {
      const landmarks = document.querySelectorAll(`[role="${element}"]`);
      landmarks.forEach((landmark, index) => {
        if (landmark.id === '') {
          landmark.setAttribute('id', `${element}-${index}`);
        }

        if (landmarks.length > 1) {
          if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
            landmark.setAttribute('aria-label', `${element} ${index + 1}`);
          }
        }
      });
    });
  },

  addSVGAccessibilityProps: function() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach((svg) => {
      let titleElement = svg.querySelector('title');
      if (!titleElement) {
        titleElement = document.createElement('title');
        titleElement.textContent = 'Image';
        svg.insertBefore(titleElement, svg.firstChild);
      }

      if (!titleElement.id) {
        titleElement.id = `svg-title-${Math.floor(Math.random() * 10000)}`;
      }

      svg.setAttribute('aria-labelledby', titleElement.id);

      if (!svg.hasAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    });
  },

  fixFakeLinks: function() {
    const fakeLinks = document.querySelectorAll('[href]:not(a)');
    fakeLinks.forEach((link) => {
      link.setAttribute('role', 'link');
      link.setAttribute('tabindex', '0');
      link.setAttribute('data-interactive', 'true');
    });
  },

  preserveExistingCode: function() {
    // This is the existing code that needs to be preserved
    // _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
    // <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
    // _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
    // <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
    // _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
    // <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
  },

  newFunction: function() {
    // New function implementation from origin/main
  },

  renderGraphIndex: function(graphData) {
    // Placeholder for the new rendering logic
    // This function should use the new functions for rendering the graph/index
    // For example, it could call `setSvgAccessibilityProps`, `addAccessibleNamesToSVGs`, etc.
    // Replace this with the actual implementation details
    renderDependencyGraph(graphData);
  },

  getSvgAccessibleName: function(svgElement) {
    const title = svgElement.querySelector('title');
    const desc = svgElement.querySelector('desc');

    if (title && title.textContent) {
      return title.textContent.trim();
    }

    if (desc && desc.textContent) {
      return desc.textContent.trim();
    }

    const ariaLabel = svgElement.getAttribute('aria-label');
    if (ariaLabel) {
      return ariaLabel.trim();
    }

    const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
      const labeledElement = document.getElementById(ariaLabelledby);
      if (labeledElement && labeledElement.textContent) {
        return labeledElement.textContent.trim();
      }
    }

    return 'SVG graphic';
  },

  renderDependencyGraph: function(deps, options = {}) {
    // Use dependencyGraphContent from the imported module
    return dependencyGraphContent(deps, options);
  },

  renderIndex: function(data, options = {}) {
    // Use indexContent from the imported module
    return indexContent(data, options);
  },

  wrapPrimaryContentInMain: function() {
    if (typeof document === 'undefined' || !document.body) {
      return null;
    }

    let mainElement = document.querySelector('main');
    if (mainElement) {
      return mainElement;
    }

    const elementsToExclude = [];
    const landmarks = document.querySelectorAll('header, nav, aside, footer, [role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"]');
    landmarks.forEach(landmark => elementsToExclude.push(landmark));

    mainElement = document.createElement('main');

    const bodyChildren = Array.from(document.body.children);
    bodyChildren.forEach(child => {
      if (!elementsToExclude.includes(child)) {
        mainElement.appendChild(child);
      }
    });

    document.body.appendChild(mainElement);

    return mainElement;
  },

  checkLandmarks: function(container = document) {
    // (code for checkLandmarks remains the same)
  },

  ensureUniqueLandmarks: function() {
    const mains = document.querySelectorAll('main, [role="main"]');
    if (mains.length > 1) {
      console.warn('Multiple main landmarks detected. Ensure only one main landmark exists.');
      throw new Error('Document should have at most one main landmark');
    }
  },

  revokeSession: function(sessionId) {
    return appState.sessions.delete(sessionId);
  },

  handleFocusTrap: function(element) {
    if (!element || typeof element.querySelectorAll !== 'function') {
      return;
    }

    const focusableElements = Array.from(element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));

    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(event) {
      if (event.key !== 'Tab') {
        return;
      }

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
    });
  },

  // Add lang attribute to HTML element if missing
  addLangAttribute: function(container) {
    const htmlElement = container.querySelector('html') || container.ownerDocument?.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', getLangAttribute(container));
      return true;
    }
    return false;
  },

  // Add main landmark if missing
  addMainLandmark: function(container) {
    const mainElement = container.querySelector('main, [role="main"]');
    if (!mainElement) {
      const body = container.querySelector('body');
      if (body) {
        const newMain = document.createElement('main');
        while (body.firstChild) {
          newMain.appendChild(body.firstChild);
        }
        return true;
      }
    }
    return false;
  },

  // Fix landmark issues by ensuring proper roles and accessible names
  fixLandmarkIssues: function(container) {
    const landmarkElements = container.querySelectorAll('header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"]');
    const processedLandmarks = new Set();
    let fixesCount = 0;

    landmarkElements.forEach(landmark => {
      if (processedLandmarks.has(landmark)) return;
      processedLandmarks.add(landmark);

      if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
        const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
        const previousSibling = landmark.previousElementSibling;

        if (previousSibling && previousSibling.textContent.trim()) {
          const labelId = `landmark-label-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const labelSpan = container.ownerDocument.createElement('span');
          labelSpan.id = labelId;
          labelSpan.textContent = previousSibling.textContent.trim();
          labelSpan.style.display = 'none';
          landmark.parentNode.insertBefore(labelSpan, landmark);
          landmark.setAttribute('aria-labelledby', labelId);
        } else {
          const roleLabel = role.charAt(0).toUpperCase() + role.slice(1).replace(/[^a-zA-Z]/g, ' ');
          landmark.setAttribute('aria-label', roleLabel);
        }
        fixesCount++;
      }
    });

    return fixesCount;
  },

  // Fix fake link issues (elements that look like links but are missing href)
  fixFakeLinkIssues: function(container) {
    const uniqueFakeLinksFixed = new Set();
    const fakeLinks = container.querySelectorAll('a:not([href]), [role="link"]:not([href])');
    let fixesCount = 0;

    fakeLinks.forEach(element => {
      if (uniqueFakeLinksFixed.has(element)) return;

      const isNavigation = element.closest('nav') !== null;

      if (isNavigation || element.tagName.toLowerCase() === 'a') {
        if (!element.hasAttribute('href')) {
          element.setAttribute('href', '#' + (element.id || `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`));
          element.setAttribute('role', 'link');
          uniqueFakeLinksFixed.add(element);
          fixesCount++;
        }
      } else {
        element.setAttribute('role', 'button');
        if (!element.hasAttribute('tabindex')) {
          element.setAttribute('tabindex', '0');
        }
        uniqueFakeLinksFixed.add(element);
        fixesCount++;
      }
    });

    return fixesCount;
  },

  // Validate accessibility report
  validateAccessibilityReport: function(container) {
    const report = validateAccessibilityReport(container);
    if (report && report.length > 0) {
      console.warn(`Accessibility report contains ${report.length} remaining issues`);
    }
    return report;
  },

  // Implement focus trap for keyboard navigation
  focusTrap: function(container) {
    this.handleFocusTrap(container);
  }
};

// HTTP Server setup
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // CORS headers for credential responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Health check endpoint
    if (parsedUrl.pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', sessions: getActiveSessionsCount() }));
        return;
    }

    // Credential response endpoint
    if (parsedUrl.pathname === '/api/credential' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const credentialResponse = JSON.parse(body);
                const result = handleCredentialResponse(credentialResponse);

                res.writeHead(result.status === 'success' ? 200 : 400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', message: 'Invalid JSON' }));
            }
        });
        return;
    }

    // Session validation endpoint
    if (parsedUrl.pathname === '/api/session/validate' && req.method === 'GET') {
        const sessionId = parsedUrl.query.sessionId;

        if (!sessionId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'error', message: 'Session ID required' }));
            return;
        }

        const session = validateSession(sessionId);

        if (session) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'valid', user: session.user }));
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'invalid', message: 'Session expired or invalid' }));
        }
        return;
    }

    // Session revocation endpoint
    if (parsedUrl.pathname === '/api/session/revoke' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const { sessionId } = JSON.parse(body);
                const revoked = revokeSession(sessionId);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: revoked ? 'success' : 'error' }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', message: 'Invalid request' }));
            }
        });
        return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'error', message: 'Not found' }));
});

// Start server if this is the main module
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export modules for testing
module.exports = {
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  validateTableAccessibility,
  renderDependencyGraph: a11yStore.renderDependencyGraph,
  renderIndex: a11yStore.renderIndex,
  renderGraphIndex: a11yStore.renderGraphIndex,
  newFunction: a11yStore.newFunction,
  checkLandmarkElement: a11yStore.checkLandmarkElement,
  wrapPrimaryContentInMain: a11yStore.wrapPrimaryContentInMain,
  checkLandmarks: a11yStore.checkLandmarks,
  ensureUniqueLandmarks: a11yStore.ensureUniqueLandmarks,
  handleFocusTrap: a11yStore.handleFocusTrap,
  revokeSession: a11yStore.revokeSession,
  functionA,
  functionB
};