/**
 * Main application entry point - Integrated Accessibility-focused and Credential Handling
 */

// Functions to ensure the element has an id, add aria-label, render dependency graphs,
// count dependencies, validate table, landmark, and handle credential responses

const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');

const app = express();
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: process.env.NODE_ENV !== 'production',
  version: '1.0.0'
};

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

// Common utility functions
const hello = () => {
  return 'Hello from main.js';
};

const getVersion = () => '1.0.0';

const getConfig = () => ({ ...config });

const calculateDifference = (a, b) => a - b;
const calculateProduct = (a, b) => a * b;
const isNumber = (value) => typeof value === 'number' && !isNaN(value);
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Credential handling function
function handleCredentialResponse(response) {
    if (!response) {
        return { success: false, error: 'No credential response provided' };
    }

    const hasCredential = response.credential || response.token || response.id;
    
    if (!hasCredential) {
        return { success: false, error: 'Invalid credential response format' };
    }

    const processedCredential = {
        id: response.id || null,
        token: response.token || response.credential || null,
        name: response.name || 'Anonymous User',
        email: response.email || null,
        success: true
    };

    // Enhanced credential parsing for Google Sign-In
    if (response.credential) {
        try {
            // Credential is a base64-encoded JWT
            if (typeof atob !== 'undefined') {
                const payload = JSON.parse(atob(response.credential.split('.')[1]));
                processedCredential.id = payload.sub || processedCredential.id;
                processedCredential.email = payload.email || processedCredential.email;
                processedCredential.name = payload.name || processedCredential.name;
            }
        } catch (error) {
            console.warn('Failed to parse credential response:', error);
        }
    }

    // Announce success to screen readers if available
    if (typeof announceToScreenReader === 'function') {
        announceToScreenReader('User successfully authenticated');
    }

    return processedCredential;
}

// Browser-specific accessibility functions (only execute in browser environment)
if (typeof document !== 'undefined') {
    
    function initializeAccessibility() {
      const svgElements = document.querySelectorAll('svg');

      svgElements.forEach((svg) => {
        if (!svg.id) {
          svg.setAttribute('id', `svg-${Math.random().toString(36).substr(2, 9)}`);
        }
        if (!svg.getAttribute('role')) {
          svg.setAttribute('role', 'img');
        }

        const accessibleName = getSvgAccessibleName(svg);
        if (accessibleName) {
          svg.setAttribute('aria-label', accessibleName);
        }

        setSvgAttributes(svg);
      });
    }

    function getSvgAccessibleName(svg) {
      const title = svg.querySelector('title');
      if (title) {
        return title.textContent;
      }
      return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || '';
    }

    function setSvgAttributes(svg) {
      if (!svg.getAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    }

    function setupAriaLiveRegions() {
      const liveRegion = document.getElementById('aria-live-region');
      if (!liveRegion) {
        const region = document.createElement('div');
        region.id = 'aria-live-region';
        region.setAttribute('aria-live', 'polite');
        region.setAttribute('aria-atomic', 'true');
        region.className = 'sr-only';
        document.body.appendChild(region);
      }
    }

    function setupFocusManagement() {
      // Trap focus within modal dialogs
      const modals = document.querySelectorAll('[role="dialog"]');
      modals.forEach((modal) => {
        modal.addEventListener('keydown', trapFocus);
      });

      // Ensure all interactive elements are keyboard accessible
      const interactiveElements = document.querySelectorAll(
        'button, a, input, select, textarea, [tabindex]'
      );
      interactiveElements.forEach((element) => {
        if (!element.hasAttribute('tabindex')) {
          element.setAttribute('tabindex', '0');
        }
      });
    }

    function enhanceSemanticMarkup() {
      // Add skip link if not present
      if (!document.getElementById('skip-link')) {
        const skipLink = document.createElement('a');
        skipLink.id = 'skip-link';
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        document.body.insertBefore(skipLink, document.body.firstChild);
      }

      // Ensure images have alt attributes
      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        if (!img.hasAttribute('alt')) {
          img.setAttribute('alt', '');
          img.setAttribute('role', 'presentation');
        }
      });

      // Ensure form inputs have associated labels
      const inputs = document.querySelectorAll('input, select, textarea');
      inputs.forEach((input) => {
        const id = input.id || `input-${Math.random().toString(36).substr(2, 9)}`;
        input.id = id;
        if (!input.hasAttribute('aria-label') && !document.querySelector(`label[for="${id}"]`)) {
          input.setAttribute('aria-label', input.name || 'Input field');
        }
      });
    }

    function closeOpenDialogs() {
      const openDialogs = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
      openDialogs.forEach((dialog) => {
        dialog.setAttribute('aria-hidden', 'true');
      });
    }

    function announceToScreenReader(message) {
      const liveRegion = document.getElementById('aria-live-region');
      if (liveRegion) {
        liveRegion.textContent = '';
        // Slight delay to ensure screen readers pick up the change
        setTimeout(() => {
          liveRegion.textContent = message;
        }, 100);
      }
    }

    function trapFocus(event) {
      const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const modal = event.target;
      const focusableContent = modal.querySelectorAll(focusableElements);
      const firstFocusableElement = focusableContent[0];
      const lastFocusableElement = focusableContent[focusableContent.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          event.preventDefault();
        }
      }
    }

    function handleKeyNavigation(event) {
      // Handle keyboard navigation
      if (event.key === 'Tab') {
        // Ensure focus is visible
        document.body.classList.add('keyboard-navigation');
      }
    }

    function addLangAttribute() {
      const html = document.documentElement;
      if (!html.hasAttribute('lang')) {
        html.setAttribute('lang', 'en');
      }
    }

    function createInPageButton(buttonId, buttonText) {
      const button = document.createElement('button');
      button.id = buttonId;
      button.textContent = buttonText;
      return button;
    }

    function addressAccessibilityIssues(issues) {
      // Process and fix accessibility issues
      return issues || [];
    }

    function generateAccessibilityReport(accessibilityReport) {
      if (!accessibilityReport || !accessibilityReport.issues) {
        return [];
      }

      const report = accessibilityReport.issues.map(issue => ({
        issueType: issue.type,
        status: issue.status || 'pending',
        fixApplied: issue.fixApplied || ''
      }));

      return report;
    }

    function calculateAccessibilityScore(fixedIssues) {
      if (!Array.isArray(fixedIssues)) {
        return 0;
      }

      const scorePoints = {
        'color-contrast': 5,
        'missing-alt-text': 3,
        'missing-aria-label': 5,
        'heading-order': 2,
        'other': 1
      };

      return fixedIssues.reduce((score, issue) => {
        const points = scorePoints[issue.type] || scorePoints['other'];
        return score + points;
      }, 0);
    }

    function validateLandmark(source) {
      const mainBlockRegex = /<main[^>]*>[\s\S]*?<\/main>/gi;
      const matches = source.match(mainBlockRegex);
      if (!matches || matches.length <= 1) {
        return source;
      }

      let result = source;
      for (let i = 1; i < matches.length; i++) {
        const block = matches[i];
        result = result.replace(block, '');
      }

      return result;
    }

    function spawnSomeCommand() {
      // Placeholder for command spawning functionality
      console.log('Command spawned');
    }

    // Initialize browser-specific functionality
    function init() {
      addLangAttribute();
      initializeAccessibility();
      setupAriaLiveRegions();
      setupFocusManagement();
      enhanceSemanticMarkup();
      
      // Add keyboard navigation listener
      document.addEventListener('keydown', handleKeyNavigation);
      
      // Announce initialization to screen readers
      announceToScreenReader('Application initialized');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
}

// Browser/Node.js compatible functions
function ensureElementHasId(element) {
    if (!element) return;
    const name = element.getAttribute('id');
    if (!name) {
        element.id = `element-${Math.random().toString(36).substr(2, 11)}`;
    }
}

function ensureElementId(element, id) {
    if (!element.id) {
        element.id = id;
    }
    return element;
}

function addAriaLabel(element, label) {
    if (!label) {
        throw new Error('aria-label value is required');
    }
    element.setAttribute('aria-label', label);
    return element;
}

function checkTableStructure(tableElement) {
    if (!tableElement || tableElement.tagName !== 'TABLE') {
        return { valid: false, error: 'Invalid table element provided' };
    }

    const tableHeader = tableElement.querySelector('thead');
    const tableBody = tableElement.querySelector('tbody');
    const tableRows = tableElement.querySelectorAll('tr');

    return {
        valid: tableHeader !== null && tableBody !== null && tableRows.length > 0,
        hasHeader: tableHeader !== null,
        hasBody: tableBody !== null,
        rowCount: tableRows.length
    };
}

function addSvgAccessibleName(svgElement, name) {
    if (!svgElement || !name) return svgElement;

    let title = svgElement.querySelector('title');
    if (!title) {
        title = document.createElement('title');
        svgElement.insertBefore(title, svgElement.firstChild);
    }
    title.textContent = name;

    const ariaLabelledBy = svgElement.getAttribute('aria-labelledby');
    if (!ariaLabelledBy && !svgElement.getAttribute('aria-label')) {
        title.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
        svgElement.setAttribute('aria-labelledby', title.id);
    }

    return svgElement;
}

function addressAccessibilityIssuesFromReport(insightReport) {
    const addressedIssues = [];

    if (!insightReport || !insightReport.sections) {
        return addressedIssues;
    }

    // Process each section of the insight report
    insightReport.sections.forEach((section, index) => {
        if (section.heading) {
            addressedIssues.push(`Addressed issue in section: ${section.heading}`);
        }

        // Check for accessibility-related content
        if (section.content) {
            // Check for table structure issues
            if (section.content.includes('table structure') && typeof checkTableStructure === 'function') {
                const tableIssues = checkTableStructure();
                addressedIssues.push(`Table structure issue addressed with ${tableIssues.rowCount} rows impacted`);
            }
        }
    });

    return addressedIssues;
}

// Server setup
app.use(express.json());

function startApp() {
    app.post('/credential', (req, res) => {
        const response = req.body.credential || req.body.token;
        const credentialResponse = handleCredentialResponse(response);

        if (!credentialResponse.success) {
            res.status(401).json(credentialResponse);
        } else {
            // Access dense analytics data
            res.json({ message: 'Credentials received and processed successfully' });
        }
    });

    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', config }));
    });

    server.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
    });
}

// Count dependencies function
function countDependencies() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
}

// Sample insight report for testing
const sampleInsightReport = {
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
};

// Accessibility utilities object
const AddressabilityIssues = {
    validateLandmark(source) {
        return validateLandmark(source);
    },

    generateAccessibilityReport(accessibilityReport) {
        return generateAccessibilityReport(accessibilityReport);
    },

    calculateAccessibilityScore(fixedIssues) {
        return calculateAccessibilityScore(fixedIssues);
    },

    addressAccessibilityIssues(issues) {
        return addressAccessibilityIssues(issues);
    }
};

// Export all functions for both Node.js and browser use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Server and app functions
        startApp,
        config,
        app,
        appState,
        
        // Utility functions
        hello,
        getVersion,
        getConfig,
        calculateDifference,
        calculateProduct,
        isNumber,
        clamp,
        countDependencies,
        
        // Credential handling
        handleCredentialResponse,
        
        // Accessibility functions (browser-compatible)
        ensureElementHasId,
        ensureElementId,
        addAriaLabel,
        addLangAttribute,
        checkTableStructure,
        addSvgAccessibleName,
        addressAccessibilityIssuesFromReport,
        createInPageButton,
        
        // Browser-specific accessibility functions (will be undefined in Node.js)
        initializeAccessibility,
        getSvgAccessibleName,
        setSvgAttributes,
        setupAriaLiveRegions,
        setupFocusManagement,
        enhanceSemanticMarkup,
        closeOpenDialogs,
        announceToScreenReader,
        trapFocus,
        handleKeyNavigation,
        addressAccessibilityIssues,
        generateAccessibilityReport,
        calculateAccessibilityScore,
        validateLandmark,
        spawnSomeCommand,
        
        // Sample data
        sampleInsightReport,
        
        // Accessibility utilities
        AddressabilityIssues
    };
}