// Main.js - Application entry point
// Accessibility utilities and dependency graph rendering
const fs = require('fs');
const path = require('path');
const dependencyGraph = require('./dependencyGraph');
const dependencyGraphContent = require('./dependencyGraphContent');
const { class1, function1, Object1 } = require('./path/to/module');

// Example of preserved functionality
function helloWorld() {
  return 'Hello, World!';
}

// Original logic preserved from commit dbc62f0d7ea6e8ed531f9712000039619b9f3d51

/**
 * Gets the accessible name for an SVG element.
 * @param {SVGElement} svgElement - The SVG element to get the accessible name for
 * @returns {string|null} The accessible name or null if not found
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;

  const title = svgElement.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }

  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }

  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const label = document.getElementById(labelledBy);
    if (label) {
      return label.textContent.trim();
    }
  }

  return null;
}

// Address accessibility issues from insight report:

module.exports = {
  addProperLandmarkRegions: () => ({
    // Your implementation here
  }),
  getSvgAccessibleName,
  helloWorld,
  formatDate,
  debounce,
  generateId,
  // ... other existing exports ...
};

// Utility functions (added from the new changes)
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function generateId() {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// Content Script for Translation Extension
// Integrated as additional feature module
(function() {
    'use strict';

    // Configuration
    const config = {
        defaultLang: 'en',
        buttonPosition: 'fixed',
        buttonBottom: '20px',
        buttonRight: '20px'
    };

    // State
    let currentLang = config.defaultLang;
    let inPageButton = null;

    /**
     * Gets the language attribute value for the HTML element
     * @returns {string} The language code (e.g., 'en', 'es', 'fr')
     */
    function getLangAttribute() {
        // Try to get lang from document.documentElement first
        const htmlLang = document.documentElement.getAttribute('lang');
        if (htmlLang && htmlLang.trim() !== '') {
            return htmlLang.trim();
        }

        // Fallback: try to detect from browser or meta tags
        const metaLang = document.querySelector('meta[http-equiv="content-language"]');
        if (metaLang) {
            const content = metaLang.getAttribute('content');
            if (content) {
                return content.split(',')[0].trim();
            }
        }

        // Default to browser language if available
        if (navigator.language) {
            return navigator.language.split('-')[0];
        }

        return config.defaultLang;
    }

    /**
     * Creates and inserts the in-page translation button
     */
    function createInPageButton() {
        // Remove existing button if present
        if (inPageButton) {
            inPageButton.remove();
        }

        // Get the lang attribute for the HTML element
        const langAttr = getLangAttribute();

        // Create the button element
        inPageButton = document.createElement('button');
        inPageButton.id = 'translation-ext-button';
        inPageButton.innerHTML = '🌐';
        inPageButton.title = `Current language: ${langAttr.toUpperCase()}`;
        
        // Apply styles
        inPageButton.style.cssText = `
            position: ${config.buttonPosition};
            bottom: ${config.buttonBottom};
            right: ${config.buttonRight};
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background-color: #4A90D9;
            color: white;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 2147483647;
        `;

        // Add click event
        inPageButton.addEventListener('click', function() {
            handleButtonClick();
        });

        // Add hover effects
        inPageButton.addEventListener('mouseenter', function() {
            inPageButton.style.transform = 'scale(1.1)';
        });

        inPageButton.addEventListener('mouseleave', function() {
            inPageButton.style.transform = 'scale(1)';
        });

        // Insert the button into the page
        document.body.appendChild(inPageButton);

        // Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
        document.documentElement.setAttribute('lang', langAttr);

        return inPageButton;
    }

    /**
     * Handles button click events
     */
    function handleButtonClick() {
        console.log('Translation button clicked');
        // Translation logic would go here
    }

    /**
     * Initializes the content script
     */
    function init() {
        // Set current language from attribute
        currentLang = getLangAttribute();
        
        // Create the in-page button
        createInPageButton();

        console.log('Translation extension initialized with lang:', currentLang);
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export functions for testing (if needed)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            getLangAttribute,
            createInPageButton,
            handleButtonClick,
            init
        };
    }
})();