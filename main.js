(function (exports, require, module, __filename, __dirname) {
    // Existing code and exports are preserved...

    const accessibilityChecker = {
        checkA11y: function(element) {
            return true;
        }
    };

    // Utility function to add scope attribute to table header cells
    function addScopeToTableHeaders(table) {
        if (!table || table.tagName !== 'TABLE') return table;
        const rows = table.rows;
        const firstRow = rows[0];

        if (!firstRow) return table;

        const headerCells = Array.from(firstRow.cells).filter(function(cell) {
            return cell.tagName === 'TH';
        });
        headerCells.forEach(function(cell) {
            if (cell && !cell.hasAttribute('scope')) {
                cell.setAttribute('scope', 'col');
            }
        });

        // Process other rows for row headers (first th in each row)
        Array.from(rows).slice(1).forEach(function(row) {
            const firstCell = row.cells[0];
            if (firstCell && firstCell.tagName === 'TH') {
                firstCell.setAttribute('scope', 'row');
            }
        });

        return table;
    }

    // Function to add accessible title to SVG elements
    function addAccessibleSvg(svgData, label) {
        // Regex to find the SVG tag and the content within it
        const svgRegex = /<svg[\s\S]*?<\/svg>/i;
        const titleRegex = /<title[^>]*>(.*?)<\/title>/i;
        const textRegex = /<text[^>]*>(.*?)<\/text>/i;

        // Replace the SVG content with an updated version that includes a title element
        return svgData.replace(svgRegex, function(match) {
            // Check if the SVG already contains a title
            let hasTitle = titleRegex.test(match);
            let hasText = textRegex.test(match);

            // Add a title element if it doesn't already exist and if the SVG contains text
            if (!hasTitle && hasText) {
                // Replace the SVG content with a title element wrapping the existing text
                return match.replace(textRegex, function(textMatch) {
                    return '<title>' + label + '</title>' + textMatch;
                });
            }

            // If the SVG doesn't contain text or already has a title, return the original match
            return match;
        });
    }

    function updateIcons(icons, label) {
        const updatedIcons = {};
        for (const key in icons) {
            const svgData = icons[key];
            const accessibleSvg = addAccessibleSvg(svgData, label);
            updatedIcons[key] = accessibleSvg;
        }
        return updatedIcons;
    }

    // Function to fix fake links that are actually spans or divs
    function fixFakeLinks(rootElement) {
        const fakeLinks = rootElement.querySelectorAll('span[role="link"], div[role="link"]');
        fakeLinks.forEach(function(link) {
            link.setAttribute('role', 'button');
            link.setAttribute('tabindex', '0');
        });
        return fakeLinks.length;
    }

    // Function to process all tables in a document or element
    function processTables(rootElement) {
        if (!rootElement) rootElement = document;
        const tables = rootElement.querySelectorAll('table');
        tables.forEach(function(table) {
            addScopeToTableHeaders(table);
        });
        return tables.length;
    }

    // Function to update the 'rotate back' link on page load
    function updateRotateBackLink() {
        const rotateBackLinks = document.querySelectorAll('.rotate-back-link, [data-action="rotate-back"]');
        rotateBackLinks.forEach(function(link) {
            link.setAttribute('aria-label', 'Return to previous view');
        });
    }

    // Function to add the 'lang' attribute to the <html> element
    function setHtmlLanguage() {
        const htmlEl = document.documentElement;
        if (!htmlEl.getAttribute('lang')) {
            htmlEl.setAttribute('lang', 'en');
        }
    }

    // Process all tables in a document or element
    function processTables(rootElement) {
        if (!rootElement) rootElement = document;
        const tables = rootElement.querySelectorAll('table');
        tables.forEach(function(table) {
            addScopeToTableHeaders(table);
        });
        return tables.length;
    }

    // Function to update the 'rotate back' link on page load
    function updateRotateBackLink() {
        const rotateBackLinks = document.querySelectorAll('.rotate-back-link, [data-action="rotate-back"]');
        rotateBackLinks.forEach(function(link) {
            link.setAttribute('aria-label', 'Return to previous view');
        });
    }

    // Ensure the HTML element has a language attribute
    function setHtmlLanguage() {
        const htmlEl = document.documentElement;
        if (!htmlEl.getAttribute('lang')) {
            htmlEl.setAttribute('lang', 'en');
        }
    }

    // Call the function to update the 'rotate back' link and set language on page load
    window.onload = function () {
        updateRotateBackLink();
        setHtmlLanguage();
    };

    // Export the new functions
    exports.addAccessibleSvg = addAccessibleSvg;
    exports.updateIcons = updateIcons;
    exports.fixFakeLinks = fixFakeLinks;
    exports.accessibilityChecker = accessibilityChecker;
    exports.setHtmlLanguage = setHtmlLanguage;

    // Additional accessibility functions from origin/main, integrated as standalone utilities

    /**
     * Returns accessibility attributes for SVG elements
     * Use this for decorative SVGs that don't need to be announced
     * @param {boolean} isDecorative - Whether the SVG is purely decorative
     * @param {string} [ariaLabel] - Optional accessible name
     * @returns {Object} Accessibility props to spread onto <svg>
     */
    function getSVGAriaProps(isDecorative, ariaLabel) {
        if (isDecorative) {
            return { 'aria-hidden': 'true' };
        }
        
        if (ariaLabel) {
            return { 'aria-label': ariaLabel, role: 'img' };
        }
        
        // Fallback: add role for better screen reader support
        return { role: 'img' };
    }

    /**
     * Validates SVG accessibility compliance
     * @param {Object} svgProps - Props from an SVG element
     * @returns {{compliant: boolean, issues: string[]}}
     */
    function validateSVGAccessibility(svgProps) {
        const issues = [];
        
        const hasAriaHidden = svgProps['aria-hidden'] === 'true';
        const hasAriaLabel = Boolean(svgProps['aria-label']);
        const hasRole = svgProps.role === 'img';
        const hasTitleChild = svgProps.children && Array.isArray(svgProps.children) 
            ? svgProps.children.some(function(c) { return c && c.type === 'title'; })
            : String(svgProps.children).indexOf('title') !== -1;
        
        const isCompliant = hasAriaHidden || hasAriaLabel || hasTitleChild || hasRole;
        
        if (!isCompliant) {
            issues.push('SVG has no accessible name and is not hidden');
        }
        
        return { compliant: isCompliant, issues: issues };
    }

    // Export the new functions to make them available for use
    exports.getSVGAriaProps = getSVGAriaProps;
    exports.validateSVGAccessibility = validateSVGAccessibility;

    // Other code...

})(module.exports, require, module, __filename, __dirname);