// Main JavaScript file
// This file handles the main application logic

(function() {
    'use strict';

    // Preserving accessibility enhancements from original commitment
    // Version 1 implementation (HEAD branch) - accessibility features integrated
    //_Commit: 0cc7acc93dade1532e36e2e26adc7bd895ef60df_
    //<!-- todo-hash: 398424c02b2e0a493981d83f7e0c15b42542e233 -->

    // DOM Elements
    const dependencyGraph = document.getElementById('dependencyGraph');

    // Import required modules and React components
    const axe = require('axe-core');
    const fs = require('fs');
    const path = require('path');
    const a11y = require('./AccessibilityUtilities');

    // Assuming that pages are in './pages' directory with `.js` or `.jsx` extension
    const pagesDir = path.join(__dirname, 'pages');

    // Function to scan pages for accessibility issues and generate a report
    async function scanAccessibility() {
      const filePaths = await fs.promises.readdir(pagesDir);
      const issues = [];

      for (const filePath of filePaths) {
        const fullPath = path.join(pagesDir, filePath);
        const { violations } = await axe.analyze(fullPath);

        if (violations.length > 0) {
          issues.push({
            file: filePath,
            issues: violations,
          });
        }
      }

      return issues;
    }

    // Function to write the generated report to a file
    function writeReport(report) {
      const reportFile = path.join(__dirname, 'accessibility_report.json');
      fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    }

    // Function to generate a report based on accessibility issues
    async function generateAccessibilityReport() {
      try {
        const issues = await scanAccessibility();
        const report = {
          generatedAt: new Date().toISOString(),
          totalFilesScanned: issues.length,
          totalIssuesFound: issues.reduce((sum, file) => sum + file.issues.length, 0),
          filesWithIssues: issues.map(file => ({
            fileName: file.file,
            issueCount: file.issues.length,
            issues: file.issues.map(issue => ({
              id: issue.id,
              description: issue.description,
              impact: issue.impact,
              nodes: issue.nodes.length
            }))
          }))
        };

        writeReport(report);
        return report;
      } catch (error) {
        console.error('Error generating accessibility report:', error);
        throw error;
      }
    }

    // Function to get the language attribute value
    function getLangAttribute() {
      return document.documentElement.lang || 'en';
    }

    // Function to create an in-page button
    function createInPageButton() {
      const button = document.createElement('button');
      button.textContent = 'Accessibility Info';
      button.setAttribute('aria-label', 'Show accessibility information');
      document.body.appendChild(button);
    }

    // Function to validate table accessibility
    function validateTableAccessibility() {
      const tables = document.querySelectorAll('table');
      tables.forEach(table => {
        if (!table.hasAttribute('summary')) {
          table.setAttribute('summary', 'Table summary');
        }
        if (!table.querySelector('caption')) {
          const caption = document.createElement('caption');
          caption.textContent = 'Table caption';
          table.prepend(caption);
        }
      });
    }

    // Function to validate table structure
    function validateTableStructure() {
      const tables = document.querySelectorAll('table');
      tables.forEach(table => {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
          const cells = row.querySelectorAll('th, td');
          cells.forEach(cell => {
            if (!cell.hasAttribute('scope') && cell.tagName === 'TH') {
              cell.setAttribute('scope', 'col');
            }
          });
        });
      });
    }

    // Function to validate landmark elements
    function validateLandmark() {
      const requiredLandmarks = ['main', 'nav', 'footer'];
      const missingLandmarks = [];

      requiredLandmarks.forEach(landmark => {
        const element = document.querySelector(`[role="${landmark}"]`) ||
                       document.querySelector(`${landmark}`);
        if (!element) {
          missingLandmarks.push(landmark);
        }
      });

      if (missingLandmarks.length > 0) {
        console.warn('Missing required landmarks:', missingLandmarks.join(', '));
        return false;
      }
      return true;
    }

    // Function to validate landmark structure
    function validateLandmarkStructure() {
      const landmarks = ['main', 'nav', 'aside', 'footer', 'header'];
      landmarks.forEach(landmark => {
        const elements = document.querySelectorAll(`[role="${landmark}"]`);
        elements.forEach(element => {
          if (!element.hasAttribute('aria-labelledby')) {
            const id = `${landmark}-label`;
            element.setAttribute('aria-labelledby', id);
            const label = document.createElement('h2');
            label.id = id;
            label.textContent = `${landmark} section`;
            element.prepend(label);
          }
        });
      });
    }

    // Function to get SVG accessible name
    function getSvgAccessibleName(svgElement) {
      if (!svgElement) return '';
      if (svgElement.hasAttribute('aria-label')) {
        return svgElement.getAttribute('aria-label');
      }
      if (svgElement.hasAttribute('aria-labelledby')) {
        const id = svgElement.getAttribute('aria-labelledby');
        const labelElement = document.getElementById(id);
        return labelElement ? labelElement.textContent : '';
      }
      return '';
    }

    // Function to set SVG attributes
    function setSvgAttributes(svgElement, name) {
      if (!svgElement || !name) return;
      if (!svgElement.hasAttribute('aria-label')) {
        svgElement.setAttribute('aria-label', name);
      }
      if (!svgElement.hasAttribute('role')) {
        svgElement.setAttribute('role', 'img');
      }
    }

    // Function to ensure unique landmarks
    function ensureUniqueLandmarks() {
      const landmarks = ['main', 'nav', 'aside', 'footer', 'header'];
      const landmarkCounts = {};

      landmarks.forEach(landmark => {
        const elements = document.querySelectorAll(`[role="${landmark}"]`);
        landmarkCounts[landmark] = elements.length;
      });

      for (const [landmark, count] of Object.entries(landmarkCounts)) {
        if (count > 1) {
          const elements = document.querySelectorAll(`[role="${landmark}"]`);
          elements.forEach((element, index) => {
            if (index > 0) {
              element.setAttribute('aria-label', `${landmark} landmark ${index + 1}`);
            }
          });
        }
      }
    }

    // Function to validate link accessibility
    function validateLinkAccessibility() {
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        if (!link.hasAttribute('href') || link.getAttribute('href') === '#') {
          link.setAttribute('role', 'button');
          link.setAttribute('tabindex', '0');
        }
      });
    }

    // Function to handle fake links
    function handleFakeLinks() {
      const fakeLinks = document.querySelectorAll('a[href="#"]');
      fakeLinks.forEach(link => {
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
        link.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
          }
        });
      });
    }

    // Function to add proper landmark regions
    function addProperLandmarkRegions() {
      const mainContent = document.querySelector('main');
      if (mainContent && !mainContent.hasAttribute('role')) {
        mainContent.setAttribute('role', 'main');
      }

      const navigation = document.querySelector('nav');
      if (navigation && !navigation.hasAttribute('role')) {
        navigation.setAttribute('role', 'navigation');
      }

      const aside = document.querySelector('aside');
      if (aside && !aside.hasAttribute('role')) {
        aside.setAttribute('role', 'complementary');
      }

      const footer = document.querySelector('footer');
      if (footer && !footer.hasAttribute('role')) {
        footer.setAttribute('role', 'contentinfo');
      }
    }

    // Function to address accessibility issues
    function addressAccessibilityIssues() {
      const rootContainer = document.getElementById('root') ? document.getElementById('root').parentElement : null;
      if (rootContainer) {
        rootContainer.setAttribute('role', 'main');
      }

      const skipLink = document.querySelector('[href^="#"]');
      if (skipLink) {
        skipLink.addEventListener('click', function(e) {
          const targetId = this.getAttribute('href').slice(1);
          const target = document.getElementById(targetId);
          if (target) {
            target.setAttribute('tabindex', '-1');
            target.focus();
          }
        });
      }

      document.querySelectorAll('[role="button"]').forEach(function(button) {
        button.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
          }
        });
      });

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
          document.body.classList.add('keyboard-nav');
        }
      });

      document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
      });

      const modalElement = document.getElementById('modal');
      if (modalElement && a11y && a11y.trapFocus) {
        a11y.trapFocus(modalElement);
      }
      if (a11y && a11y.announce) {
        a11y.announce('Welcome to the bot!', 'assertive');
      }

      const imageElement = document.getElementById('example-image');
      if (imageElement) {
        imageElement.setAttribute('alt', 'A description of the image');
      }

      const divElement = document.getElementById('example-div');
      if (divElement) {
        divElement.setAttribute('role', 'list');
      }

      const htmlElement = document.documentElement;
      if (htmlElement) {
        htmlElement.setAttribute('lang', getLangAttribute());
      }
    }

    // Accessibility utilities - preserves the original accessibilityUtils functionality
    const accessibilityUtils = {
        validateLandmark: validateLandmark,
        addressNewAccessibilityIssues: function(issues) {
            if (!issues || !Array.isArray(issues)) {
                return [];
            }
            return issues.map(issue => {
                return {
                    id: issue.id,
                    description: issue.description,
                    severity: issue.severity,
                    status: 'addressed',
                    addressedAt: new Date().toISOString()
                };
            });
        }
    };

    // New function to import a module and execute a function
    function importAndExecute(modulePath, functionName, callback) {
      require(modulePath)[functionName](callback);
    }

    // New function to validate table accessibility
    function validateTableAccessibility(tableElement) {
      if (!tableElement) return false;

      const hasCaption = tableElement.querySelector('caption') !== null;
      const hasHeaders = tableElement.querySelector('thead') !== null ||
                        tableElement.querySelector('th') !== null;

      const headers = tableElement.querySelectorAll('th');
      let hasScope = true;
      headers.forEach(header => {
        if (!header.hasAttribute('scope')) {
          hasScope = false;
        }
      });

      return hasCaption && hasHeaders && hasScope;
    }

    // New function to validate table structure
    function validateTableStructure(tableElement) {
      if (!tableElement) return false;

      const rows = tableElement.querySelectorAll('tr');
      let validStructure = true;

      rows.forEach(row => {
        const cells = row.querySelectorAll('td, th');
        if (cells.length === 0) {
          validStructure = false;
        }
      });

      return validStructure;
    }

    // New function to validate landmark
    function validateLandmarkElement(landmarkElement) {
      if (!landmarkElement) return false;

      const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];
      const role = landmarkElement.getAttribute('role');

      return validRoles.includes(role);
    }

    // New function to validate landmark structure
    function validateLandmarkStructureElement(landmarkElement) {
      if (!landmarkElement) return false;

      const heading = landmarkElement.querySelector('h1, h2, h3, h4, h5, h6');
      return heading !== null;
    }

    // New function to get SVG accessible name
    function getSvgAccessibleName(svgElement) {
      if (!svgElement) return '';

      const title = svgElement.querySelector('title');
      const desc = svgElement.querySelector('desc');

      if (title) return title.textContent;
      if (desc) return desc.textContent;

      if (svgElement.hasAttribute('aria-label')) {
        return svgElement.getAttribute('aria-label');
      }

      if (svgElement.hasAttribute('aria-labelledby')) {
        const id = svgElement.getAttribute('aria-labelledby');
        const labelElement = document.getElementById(id);
        return labelElement ? labelElement.textContent : '';
      }

      return '';
    }

    // New function to set SVG attributes
    function setSvgAttributesElement(svgElement, name) {
      if (!svgElement || !name) return;

      if (!svgElement.hasAttribute('aria-label')) {
        svgElement.setAttribute('aria-label', name);
      }

      if (!svgElement.hasAttribute('role')) {
        svgElement.setAttribute('role', 'img');
      }
    }

    // Export the report generation function
    module.exports = {
      generateAccessibilityReport: async function () {
        const report = await scanAccessibility();
        writeReport(report);
      },
      addressAccessibilityIssues,
      getLangAttribute,
      createInPageButton,
      a11y,
      importAndExecute,
      validateTableAccessibility,
      validateTableStructure,
      validateLandmark,
      validateLandmarkStructure,
      getSvgAccessibleName,
      setSvgAttributes
    };

    // Initialize the application with accessibility improvements
    function initialize() {
        if (dependencyGraph) {
            dependencyGraph.setAttribute('role', 'region');
            dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
        }

        // Address accessibility issues
        addressAccessibilityIssues();

        // Create the in-page button
        createInPageButton();

        if (a11y && a11y.init) {
            a11y.init();
        }
    }

    // Initialize on DOM ready
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }
    }

    // Expose validateLandmark to global scope if needed
    if (typeof window !== 'undefined') {
      window.validateLandmark = validateLandmark;
    }
})();