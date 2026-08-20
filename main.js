// main.js
(function() {
    'use strict';

    // Some existing configuration or state
    const config = {
        rotation: 0,
        maxRotation: 360
    };

    // Function to rotate an element
    function rotateElement(element, degrees) {
        if (element) {
            element.style.transform = `rotate(${degrees}deg)`;
            config.rotation = degrees;
        }
    }

    // Function to reset rotation
    function resetRotation(element) {
        rotateElement(element, 0);
    }

    // Accessibility: Set language attribute on document
    function setDocumentLanguage(lang) {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = lang;
        }
    }

    // Accessibility: Initialize landmarks with proper ARIA attributes
    function initializeLandmarks(container) {
        const mainElement = container.querySelector('main') || container.querySelector('[role="main"]');
        const navElement = container.querySelector('nav') || container.querySelector('[role="navigation"]');
        
        if (mainElement && !mainElement.id) {
            mainElement.id = 'main-content';
            mainElement.setAttribute('role', 'main');
        }
        
        if (navElement && !navElement.getAttribute('aria-label')) {
            const navCount = container.querySelectorAll('nav, [role="navigation"]').length;
            if (navCount > 1) {
                navElement.setAttribute('aria-label', 'Primary navigation');
            }
        }
    }

    // Accessibility: Ensure buttons have proper accessible names
    function ensureButtonAccessibility(button) {
        if (button && button.tagName === 'BUTTON') {
            const hasLabel = button.getAttribute('aria-label') || 
                           button.getAttribute('aria-labelledby') ||
                           button.textContent.trim().length > 0;
            
            if (!hasLabel) {
                // Add aria-label for icon-only buttons
                const svg = button.querySelector('svg');
                if (svg) {
                    const svgTitle = svg.querySelector('title');
                    if (svgTitle) {
                        button.setAttribute('aria-label', svgTitle.textContent);
                    } else {
                        button.setAttribute('aria-label', 'Button');
                    }
                }
            }
        }
    }

    // Accessibility: Fix table structure for screen readers
    function ensureTableAccessibility(table) {
        if (table && table.tagName === 'TABLE') {
            // Ensure tables have proper structure
            if (!table.querySelector('thead')) {
                const firstRow = table.querySelector('tr');
                if (firstRow) {
                    const thead = document.createElement('thead');
                    const newFirstRow = firstRow.cloneNode(true);
                    thead.appendChild(newFirstRow);
                    table.insertBefore(thead, table.firstChild);
                }
            }
            
            // Add scope to header cells if missing
            const headers = table.querySelectorAll('th');
            headers.forEach(th => {
                if (!th.getAttribute('scope')) {
                    const inThead = th.closest('thead');
                    th.setAttribute('scope', inThead ? 'col' : 'row');
                }
            });
        }
    }

    // Accessibility: Ensure links have proper text or labels
    function ensureLinkAccessibility(link) {
        if (link && link.tagName === 'A') {
            const hasText = link.textContent.trim().length > 0;
            const hasLabel = link.getAttribute('aria-label') || 
                           link.getAttribute('aria-labelledby');
            
            if (!hasText && !hasLabel) {
                const svg = link.querySelector('svg');
                const img = link.querySelector('img');
                
                if (img && img.alt) {
                    link.setAttribute('aria-label', img.alt);
                } else if (svg) {
                    const svgTitle = svg.querySelector('title');
                    link.setAttribute('aria-label', svgTitle ? svgTitle.textContent : 'Link');
                }
            }
            
            // If it's a fake link (not an <a> or button), add role="button" and tabindex
            if (!link.href && link.getAttribute('role') !== 'button') {
                link.setAttribute('role', 'button');
                link.setAttribute('tabindex', '0');
            }
        }
    }

    // Accessibility: Add live region for dynamic content updates
    function createLiveRegion(container, regionId, politeness) {
        const existing = container.querySelector(`#${regionId}`);
        if (existing) return existing;
        
        const liveRegion = document.createElement('div');
        liveRegion.id = regionId;
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', politeness || 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
        container.appendChild(liveRegion);
        return liveRegion;
    }

    // Accessibility: Announce rotation change to screen readers
    function announceRotation(degrees) {
        const liveRegion = document.querySelector('#rotation-announcement');
        if (liveRegion) {
            liveRegion.textContent = `Element rotated to ${degrees} degrees`;
        }
    }

    // Initialize on DOM ready
    function initialize() {
        const targetElement = document.querySelector('[data-rotate-target]');
        const unrotateBtn = document.querySelector('[data-unrotate-button]');
        const rotateBtn = document.querySelector('[data-rotate-button]');
        
        // Set default language
        setDocumentLanguage(document.documentElement.lang || 'en');
        
        // Initialize landmarks on the main container
        const mainContainer = document.querySelector('main') || document.querySelector('[role="main"]') || document.body;
        initializeLandmarks(mainContainer);
        
        // Create live region for accessibility announcements
        createLiveRegion(document.body, 'rotation-announcement', 'polite');
        
        // Process existing buttons for accessibility
        document.querySelectorAll('button').forEach(ensureButtonAccessibility);
        
        // Process existing tables for accessibility
        document.querySelectorAll('table').forEach(ensureTableAccessibility);
        
        // Process existing links for accessibility
        document.querySelectorAll('a').forEach(ensureLinkAccessibility);

        // Handle the rotate back button click
        if (unrotateBtn) {
            ensureButtonAccessibility(unrotateBtn);
            unrotateBtn.addEventListener('click', function(e) {
                e.preventDefault();
                resetRotation(targetElement);
                announceRotation(0);
            });
        }

        // Example: rotate on some trigger
        if (rotateBtn) {
            ensureButtonAccessibility(rotateBtn);
            rotateBtn.addEventListener('click', function() {
                const newRotation = (config.rotation + 90) % config.maxRotation;
                rotateElement(targetElement, newRotation);
                announceRotation(newRotation);
            });
        }
    }

    // Run initialization when DOM is ready
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }
    }

    // Export functions for testing or external use
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            rotateElement,
            resetRotation,
            setDocumentLanguage,
            initializeLandmarks,
            ensureButtonAccessibility,
            ensureTableAccessibility,
            ensureLinkAccessibility,
            createLiveRegion,
            announceRotation
        };
    }
})();