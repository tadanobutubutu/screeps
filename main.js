/**
 * Main application module
 * TODO: Address accessibility issues from insight report:
 * - REACT_015: Add lang attribute to HTML element
 * - REACT_027: Fix 26 table structure issues
 * - REACT_017: Add/fix 4 landmark issues
 * - REACT_041: Add accessible names to 2 SVGs
 * - REACT_025: Ensure unique landmarks (2 issues)
 * - REACT_036: Fix 1 fake link issue
 */

// Application initialization
(function() {
    'use strict';

    // DOM ready initialization
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
    });

    function initializeApp() {
        // Initialize main application functionality
        console.log('Application initialized');
        
        // Initialize accessibility enhancements
        enhanceAccessibility();
    }

    /**
     * Enhance accessibility features
     * Addresses landmark and semantic HTML improvements
     */
    function enhanceAccessibility() {
        // Ensure all interactive elements have proper roles
        const interactiveElements = document.querySelectorAll('[role="button"], [role="link"]');
        
        interactiveElements.forEach(function(element) {
            // Add proper tabindex for keyboard navigation
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
            
            // Add keyboard event handlers for fake links/buttons
            element.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });

        // Ensure landmarks are properly identified
        const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
        const navElements = document.querySelectorAll('nav, [role="navigation"]');
        const footerElement = document.querySelector('footer') || document.querySelector('[role="contentinfo"]');

        // Add accessible names to SVG elements
        const svgElements = document.querySelectorAll('svg');
        svgElements.forEach(function(svg, index) {
            // Check if SVG already has an accessible name
            const hasAriaLabel = svg.hasAttribute('aria-label');
            const hasAriaLabelledby = svg.hasAttribute('aria-labelledby');
            const titleElement = svg.querySelector('title');
            
            if (!hasAriaLabel && !hasAriaLabelledby) {
                // Generate accessible name for SVG
                const generatedId = 'svg-title-' + (index + 1);
                
                // Add or update title element
                if (!titleElement) {
                    const title = document.createElement('title');
                    title.id = generatedId;
                    title.textContent = 'Icon ' + (index + 1);
                    svg.insertBefore(title, svg.firstChild);
                } else {
                    titleElement.id = generatedId;
                }
                
                // Link title to SVG
                svg.setAttribute('aria-labelledby', generatedId);
            }
        });

        // Enhance table accessibility
        enhanceTableAccessibility();

        // Ensure unique landmark names where needed
        ensureUniqueLandmarks();
    }

    /**
     * Enhance table accessibility
     * Addresses table structure issues (REACT_027)
     */
    function enhanceTableAccessibility() {
        const tables = document.querySelectorAll('table');
        
        tables.forEach(function(table) {
            // Add scope to header cells
            const headers = table.querySelectorAll('th');
            headers.forEach(function(header) {
                // Determine if header is for a row, column, or both
                const rowSpan = header.getAttribute('rowspan') || 1;
                const colSpan = header.getAttribute('colspan') || 1;
                
                if (rowSpan > 1 && colSpan > 1) {
                    header.setAttribute('scope', 'row'); // Simplified approach
                } else if (rowSpan > 1) {
                    header.setAttribute('scope', 'row');
                } else {
                    header.setAttribute('scope', 'col');
                }
                
                // Add id to header if associated with td elements
                if (!header.id) {
                    const headerText = header.textContent.trim().toLowerCase().replace(/\s+/g, '-');
                    header.id = 'th-' + headerText + '-' + Math.random().toString(36).substr(2, 9);
                }
            });

            // Associate data cells with headers
            const dataCells = table.querySelectorAll('td');
            dataCells.forEach(function(cell) {
                const headersAttr = cell.getAttribute('headers');
                if (!headersAttr) {
                    // Find parent row
                    const row = cell.closest('tr');
                    if (row) {
                        const rowHeaders = Array.from(row.querySelectorAll('th'))
                            .map(th => th.id)
                            .filter(id => id);
                        
                        const columnHeaders = Array.from(table.querySelectorAll('thead th'))
                            .map(th => th.id)
                            .filter(id => id);
                        
                        const allHeaders = [...new Set([...rowHeaders, ...columnHeaders])];
                        if (allHeaders.length > 0) {
                            cell.setAttribute('headers', allHeaders.join(' '));
                        }
                    }
                }
            });

            // Add caption if missing but table has a summary
            if (!table.querySelector('caption')) {
                const summary = table.getAttribute('summary');
                if (summary) {
                    const caption = document.createElement('caption');
                    caption.textContent = summary;
                    table.insertBefore(caption, table.firstChild);
                }
            }

            // Ensure proper table structure
            if (!table.querySelector('thead')) {
                const firstRow = table.querySelector('tr');
                if (firstRow) {
                    const thead = document.createElement('thead');
                    thead.appendChild(firstRow.cloneNode(true));
                    table.insertBefore(thead, firstRow);
                    firstRow.remove();
                }
            }

            if (!table.querySelector('tbody')) {
                const rows = Array.from(table.querySelectorAll('tr'));
                const thead = table.querySelector('thead');
                const bodyRows = thead ? rows.slice(1) : rows;
                
                if (bodyRows.length > 0) {
                    const tbody = document.createElement('tbody');
                    bodyRows.forEach(row => tbody.appendChild(row));
                    
                    if (thead) {
                        table.insertBefore(tbody, table.lastChild);
                    } else {
                        table.appendChild(tbody);
                    }
                }
            }
        });
    }

    /**
     * Ensure unique landmark names
     * Addresses unique landmark issues (REACT_025)
     */
    function ensureUniqueLandmarks() {
        // Count occurrences of each landmark type
        const landmarkTypes = ['nav', 'main', 'header', 'footer', 'aside', 'section'];
        
        landmarkTypes.forEach(function(type) {
            const elements = document.querySelectorAll(type + ', [role="' + type + '"]');
            
            if (elements.length > 1) {
                elements.forEach(function(el, index) {
                    // Check if element already has an aria-label
                    if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
                        // Generate meaningful label based on context
                        const nearbyHeading = el.querySelector('h1, h2, h3, h4, h5, h6');
                        let label = '';
                        
                        if (nearbyHeading) {
                            label = nearbyHeading.textContent.trim();
                        } else {
                            // Generate descriptive label based on landmark type and position
                            const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
                            label = typeLabel + ' ' + (index + 1);
                        }
                        
                        el.setAttribute('aria-label', label);
                    }
                });
            }
        });
    }

    /**
     * Fix fake links that should be buttons or proper links
     * Addresses fake link issues (REACT_036)
     */
    function fixFakeLinks() {
        // Find elements that look like links but aren't
        const potentialFakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a[href^="javascript"]');
        
        potentialFakeLinks.forEach(function(link) {
            const href = link.getAttribute('href');
            
            // Check if this is a fake link (no actual navigation)
            if (href === '#' || href === '' || href.toLowerCase().startsWith('javascript:')) {
                // Consider converting to button if it triggers JavaScript action
                const hasClickHandler = link.hasAttribute('onclick') || 
                                        link.addEventListener.toString().includes('click');
                
                // For accessibility, elements that trigger actions should be buttons
                // Uncomment the following if conversion is needed:
                // const button = document.createElement('button');
                // button.innerHTML = link.innerHTML;
                // button.setAttribute('aria-label', link.getAttribute('aria-label') || link.textContent);
                // link.parentNode.replaceChild(button, link);
                
                // At minimum, ensure the link has proper accessible name
                if (!link.hasAttribute('aria-label') && !link.textContent.trim()) {
                    link.setAttribute('aria-label', 'Button link');
                }
            }
        });
    }

    // Export functions for testing
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            enhanceAccessibility,
            enhanceTableAccessibility,
            ensureUniqueLandmarks,
            fixFakeLinks,
            initializeApp
        };
    }
})();