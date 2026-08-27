/**
 * Main JavaScript file for the application
 * @fileoverview Handles application initialization and core functionality
 */

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

(function() {
    'use strict';

    // Application configuration
    const config = {
        apiUrl: '/api',
        debug: false
    };

    /**
     * Initialize the application
     * @returns {void}
     */
    function init() {
        if (config.debug) {
            console.log('Application initialized');
        }
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize accessibility features
        initializeAccessibility();
    }

    /**
     * Set up global event listeners
     * @returns {void}
     */
    function setupEventListeners() {
        document.addEventListener('DOMContentLoaded', function() {
            // Main navigation landmark
            const mainNav = document.querySelector('nav[aria-label="Main"]');
            if (mainNav) {
                mainNav.setAttribute('role', 'navigation');
                mainNav.setAttribute('aria-label', 'Main navigation');
            }

            // Footer landmark
            const footer = document.querySelector('footer');
            if (footer) {
                footer.setAttribute('role', 'contentinfo');
            }

            // Ensure unique landmark labels
            const landmarks = document.querySelectorAll('[role="navigation"]');
            landmarks.forEach((landmark, index) => {
                const currentLabel = landmark.getAttribute('aria-label');
                if (!currentLabel || landmarks.length > 1) {
                    const labels = ['Main navigation', 'Secondary navigation', 'Footer navigation'];
                    landmark.setAttribute('aria-label', labels[index] || `Navigation ${index + 1}`);
                }
            });

            // Fix fake link issues - ensure all clickable elements that look like links have proper roles
            const fakeLinks = document.querySelectorAll('[role="button"], .fake-link');
            fakeLinks.forEach(link => {
                if (link.tagName !== 'A' && link.tagName !== 'BUTTON') {
                    link.setAttribute('role', 'button');
                    if (!link.getAttribute('tabindex')) {
                        link.setAttribute('tabindex', '0');
                    }
                }
            });

            // Add accessible names to SVGs
            const svgs = document.querySelectorAll('svg');
            svgs.forEach((svg, index) => {
                const title = svg.querySelector('title');
                if (title) {
                    svg.setAttribute('role', 'img');
                    svg.setAttribute('aria-labelledby', title.id || `svg-title-${index}`);
                }
            });
        });
    }

    /**
     * Initialize accessibility features
     * @returns {void}
     */
    function initializeAccessibility() {
        // Ensure HTML lang attribute exists
        let htmlElement = document.documentElement;
        if (!htmlElement.getAttribute('lang')) {
            htmlElement.setAttribute('lang', 'en');
        }

        // Add skip link functionality
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const main = document.getElementById('main-content') || document.querySelector('main');
            if (main) {
                main.setAttribute('tabindex', '-1');
                main.focus();
            }
        });
        
        // Insert skip link at the beginning of body
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    /**
     * Get the application configuration
     * @returns {Object} The configuration object
     */
    function getConfig() {
        return { ...config };
    }

    /**
     * Set debug mode
     * @param {boolean} enabled - Whether to enable debug mode
     * @returns {void}
     */
    function setDebug(enabled) {
        config.debug = enabled;
    }

    // Export functions for use in other modules
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            init,
            getConfig,
            setDebug,
            setupEventListeners,
            initializeAccessibility
        };
    } else {
        window.App = {
            init,
            getConfig,
            setDebug,
            setupEventListeners,
            initializeAccessibility
        };
    }
})();