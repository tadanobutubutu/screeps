(function (exports, require, module, __filename, __dirname) {
    // Existing code and exports are preserved...

    const accessibilityChecker = require('./accessibility-checker');

    // Utility function to add scope attribute to table header cells
    function addScopeToTableHeaders(table) {
        if (!table || table.tagName !== 'TABLE') return table;
        const rows = table.querySelectorAll('tr');
        const firstRow = rows[0];

        if (!firstRow) return table;

        const headerCells = firstRow.querySelectorAll('th');
        headerCells.forEach(cell => {
            if (!cell.hasAttribute('scope')) cell.setAttribute('scope', 'col');
        });

        // Process other rows for row headers (first th in each row)
        rows.slice(1).forEach(row => {
            const firstCell = row.querySelector('th');
            if (firstCell && !firstCell.hasAttribute('scope'))
                firstCell.setAttribute('scope', 'row');
        });

        // This section is new, it addresses additional accessibility issues
        function addAccessibleSvg(svgContent, label) {
            // Regex to find the SVG tag and the content within it
            const svgRegex = /<svg[\s\S]*?<\/svg>/i;
            const titleRegex = /<title[^>]*>(.*?)<\/title>/i;
            const textRegex = /<text[^>]*>(.*?)<\/text>/i;

            // Replace the SVG content with an updated version that includes a title element
            return svgContent.replace(svgRegex, (match) => {
                // Check if the SVG already contains a title
                let hasTitle = titleRegex.test(match);
                let hasText = textRegex.test(match);

                // Add a title element if it doesn't already exist and if the SVG contains text
                if (!hasTitle && hasText) {
                    // Replace the SVG content with a title element wrapping the existing text
                    return match.replace(textRegex, (textMatch) => {
                        return `<title>${label}</title>${textMatch}`;
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

        function updateIconsWithHeader(icons, label) {
            const tableIcons = table.querySelectorAll('td > a > img');
            tableIcons.forEach(icon => {
                const accessibleIcon = updateIcons(window[icon.getAttribute('data-icon-set')], label);
                icon.outerHTML = `<td>${Object.values(accessibleIcon).join('')}</td>`;
            });
        }

        // Structure from another change: new accessibility functions as standalone utilities
        function getSVGAriaProps(isDecorative = false, ariaLabel) {
            if (isDecorative) {
                return { 'aria-hidden': 'true' };
            }
            if (ariaLabel) {
                return { 'aria-label': ariaLabel, role: 'img' };
            }
            // Fallback: add role for better screen reader support
            return { role: 'img' };
        }

        function validateSVGAccessibility(svgProps) {
            const issues = [];

            const hasAriaHidden = svgProps['aria-hidden'] === 'true';
            const hasAriaLabel = Boolean(svgProps['aria-label']);
            const hasRole = svgProps.role === 'img';
            const hasTitleChild = svgProps.children &&
                (Array.isArray(svgProps.children)
                    ? svgProps.children.some(c => c && c.type === 'title')
                    : svgProps.children.type === 'title');

            const isCompliant = hasAriaHidden || hasAriaLabel || hasTitleChild || hasRole;

            if (!isCompliant) {
                issues.push('SVG has no accessible name and is not hidden');
            }

            return { compliant: isCompliant, issues };
        }

        function processTables(rootElement = document) {
            const tables = rootElement.querySelectorAll('table');
            tables.forEach(addScopeToTableHeaders);
            tables.forEach(updateIconsWithHeader);
            return tables.length;
        }

        // Process all tables in a document or element
        processTables();

        // Export the new functions
        exports.addAccessibleSvg = addAccessibleSvg;
        exports.updateIcons = updateIcons;
        exports.updateRotateBackLink = updateRotateBackLink;
        exports.updateIconsWithHeader = updateIconsWithHeader;
        module.exports.addScopeToTableHeaders = addScopeToTableHeaders;
        module.exports.processTables = processTables;
        module.exports.fixFakeLinks = fixFakeLinks;
        module.exports.accessibilityChecker = accessibilityChecker;
        module.exports.getSVGAriaProps = getSVGAriaProps;
        module.exports.validateSVGAccessibility = validateSVGAccessibility;

        // Other code...
    }

    // The rest of the code remains the same...
})(module.exports, require, module, __filename, __dirname);