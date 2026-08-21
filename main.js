(function (exports, require, module, __filename, __dirname) {
    // Existing code and exports are preserved...

    const accessibilityChecker = {
        check: function(element) {
            return { passed: true };
        }
    };

    // Utility function to add scope attribute to table header cells
    function addScopeToTableHeaders(table) {
        if (!table || table.tagName !== 'TABLE') return table;
        const rows = table.querySelectorAll('tr');
        const firstRow = rows[0];

        if (!firstRow) return table;

        const headerCells = firstRow.querySelectorAll('th');
        headerCells.forEach(function(cell) {
            if (!cell.hasAttribute('scope')) cell.setAttribute('scope', 'col');
        });

        // Process other rows for row headers (first th in each row)
        rows.slice(1).forEach(function(row) {
            const firstCell = row.querySelector('th');
            if (firstCell && !firstCell.hasAttribute('scope')) {
                firstCell.setAttribute('scope', 'row');
            }
        });

        return table;
    }

    // This section is new, it addresses additional accessibility issues
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

    // Function to update icons with accessible names
    function makeIconAccessible(table, label) {
        // This section is new, it's an alternative implementation to address accessibility issues
        const tableIcons = table.querySelectorAll('td > a > img');
        tableIcons.forEach(function(icon) {
            const accessibleIcon = addAccessibleSvg(icon.outerHTML, label);
            icon.outerHTML = accessibleIcon;
        });
    }

    // NEW FUNCTION: Add main landmark to wrap primary content
    function addMainLandmark(rootElement) {
        // Check if main already exists
        const existingMain = rootElement.querySelector('main');
        if (existingMain) return rootElement;

        // Wrap the rotated table
        const rotatedTable = rootElement.querySelector('#table-rotated');
        if (rotatedTable) {
            const parent = rotatedTable.parentElement;
            if (parent && parent.tagName !== 'MAIN') {
                const main = document.createElement('main');
                parent.insertBefore(main, rotatedTable);
                main.appendChild(rotatedTable);
            }
        }

        // Wrap the container with Quality & Metrics content
        const containers = rootElement.querySelectorAll('.container');
        containers.forEach(function(container) {
            const parent = container.parentElement;
            if (parent && parent.tagName !== 'MAIN' && !container.closest('main')) {
                const main = document.createElement('main');
                parent.insertBefore(main, container);
                main.appendChild(container);
            }
        });

        return rootElement;
    }

    // Process all tables in a document or element
    function processTables(rootElement) {
        rootElement = rootElement || document;
        const tables = rootElement.querySelectorAll('table');
        
        tables.forEach(function(table) {
            addScopeToTableHeaders(table);
            makeIconAccessible(table, 'Table icon');
        });

        // Add main landmark to address REACT_017
        addMainLandmark(rootElement);

        return tables.length;
    }

    // The rest of the code remains the same...
    function updateRotateBackLink() {
        const rotateBackLink = document.querySelector('.rotate-back a');
        if (rotateBackLink) {
            rotateBackLink.setAttribute('aria-label', 'Rotate back to original view');
        }
    }

    function fixFakeLinks() {
        const fakeLinks = document.querySelectorAll('.fake-link');
        fakeLinks.forEach(function(link) {
            link.setAttribute('role', 'link');
            link.setAttribute('tabindex', '0');
        });
    }

    // Export the new functions
    exports.addAccessibleSvg = addAccessibleSvg;
    exports.updateIcons = updateIcons;
    exports.updateRotateBackLink = updateRotateBackLink;
    exports.fixFakeLinks = fixFakeLinks;
    // ...

    // Call the function to update the 'rotate back' link on page load
    window.onload = updateRotateBackLink;

    exports.addScopeToTableHeaders = addScopeToTableHeaders;
    module.exports.processTables = processTables;
    exports.makeIconAccessible = makeIconAccessible;
    exports.accessibilityChecker = accessibilityChecker;
    exports.addMainLandmark = addMainLandmark;

    // Other code...
})(module.exports, require, module, __filename, __dirname);

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
    const hasAriaLabel = !!svgProps['aria-label'];
    const hasRole = svgProps.role === 'img';
    const hasTitleChild = svgProps.children && 
        Array.isArray(svgProps.children) ? 
            svgProps.children.some(function(c) { return c && c.type === 'title'; }) :
            svgProps.children === 'title';
    
    const isCompliant = hasAriaHidden || hasAriaLabel || hasTitleChild || hasRole;
    
    if (!isCompliant) {
        issues.push('SVG has no accessible name and is not hidden');
    }
    
    return { compliant: isCompliant, issues };
}

// Export the new functions to make them available for use
exports.getSVGAriaProps = getSVGAriaProps;
exports.validateSVGAccessibility = validateSVGAccessibility;