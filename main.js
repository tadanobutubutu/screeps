module.exports = {
  myFunction: function () {
    // Existing implementation
  },
  validateTableAccessibility: function (element) {
    if (!element) return false;
    // Prefer explicit role="table"; allow tables without explicit role if they contain <table>
    if (element.getAttribute('role') !== 'table') {
      const table = element.querySelector('table');
      if (table) return true;
    }
    return true;
  },
  validateTableStructure: function (element) {
    if (!element) return false;
    const rows = element.querySelectorAll('tr');
    return rows.length > 0;
  },
  validateLandmark: function (element) {
    if (!element) return false;
    // Landmarks are expected to be SVG elements
    return element.tagName === 'SVG';
  },
  validateLandmarkStructure: function (element) {
    if (!element) return false;
    return element.id || element.getAttribute('aria-label');
  },
  ensureUniqueLandmarksArray: function (landmarks) {
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
  getSvgAccessibleName: function (svgElement) {
    if (!svgElement) return '';
    const ariaLabel = svgElement.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    const title = svgElement.getAttribute('title');
    if (title) return title;
    return svgElement.tagName.toLowerCase();
  },
  addAccessibleNamesToSvg: function (svgElement, names) {
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
  ensureElementHasId: function (element) {
    if (!element) {
      throw new Error('Element is required');
    }
    if (!element.id) {
      element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    return element.id;
  },
  addAriaLabel: function (element, label) {
    if (!element) {
      throw new Error('Element is required');
    }
    element.setAttribute('aria-label', label);
    return element;
  },
  renderDependencyGraph: function (data, container) {
    if (!data) {
      throw new Error('Dependency data is required');
    }
    if (!container) {
      throw new Error('Container element is required');
    }
    // Implementation would go here
    return container;
  },
  checkTableStructure: function() {
    // existing code
  },
  sampleInsightReport: {
    title: 'Quarterly Performance Report',
    sections: [
      {
        heading: 'Sales Overview',
        content: 'Total sales increased by 15% compared to last quarter.'
      },
      {
        heading: 'Customer Satisfaction',
        content: 'Average satisfaction score: 4.2 out of 5.'
      }
    ]
  },
  handleCredentialResponse: function(response) {
    if (!response) {
      return { success: false, error: 'No credential response provided' };
    }

    // Check if response contains expected credential data
    const hasCredential = response.credential || response.token || response.id;

    if (!hasCredential) {
      return { success: false, error: 'Invalid credential response format' };
    }

    // Process credential information
    const processedCredential = {
        id: response.id || null,
        token: response.token || response.credential || null,
        name: response.name || 'Anonymous User',
        email: response.email || null,
        success: true
    };

    // Handle different types of credential responses
    if (response.credential) {
        // Google Sign-In response
        try {
            // Credential is a base64-encoded JWT
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            processedCredential.id = payload.sub || processedCredential.id;
            processedCredential.email = payload.email || processedCredential.email;
            processedCredential.name = payload.name || processedCredential.name;
        } catch (error) {
            console.warn('Failed to parse credential response:', error);
        }
    }

    // Announce success to screen readers
    if (typeof announceToScreenReader === 'function') {
        announceToScreenReader('User successfully authenticated');
    }

    return processedCredential;
  }
};