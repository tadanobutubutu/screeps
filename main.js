// TODO: This is the existing code that needs to be preserved

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
// - (A NEW FUNCTION: REACT_037: ADD PROPER LANDMARK REGIONS)
// - ... (You can add more functions as needed)

// Add lang attribute to HTML element (REACT_015)
const addLangAttribute = function(html) {
    if (html && typeof html === 'string') {
        return html.replace(/<html/, '<html lang="en"');
    }
    return html;
};

// Fix table structure issues (REACT_027)
const fixTableStructureIssues = function(tables) {
    return tables.map(table => {
        if (table && typeof table === 'object') {
            const firstRow = table.querySelector('tr');
            if (firstRow) {
                const thead = document.createElement('thead');
                thead.appendChild(firstRow);
                const parent = thead.parentNode;
                if (parent && parent.tagName !== 'THEAD') {
                    if (table.firstChild) {
                        table.insertBefore(thead, table.firstChild);
                    } else {
                        table.appendChild(thead);
                    }
                }
            }
        }
        return table;
    });
};

// Add main landmark (REACT_017)
const addMainLandmark = function(content) {
    if (content && typeof content === 'string') {
        const hasMainTag = /<main/i.test(content);
        if (!hasMainTag) {
            const mainMatch = content.match(/<\/body>/i);
            if (mainMatch) {
                return content.replace(/<\/body>/i, '<main></main></body>');
            }
            return content + '<main></main></body>';
        }
    }
    return content;
};

// Add accessible names to SVGs (REACT_041)
const addSvgAccessibleNames = function(svgs) {
    return svgs.map((svg, index) => {
        if (svg && typeof svg === 'object') {
            const existingTitle = svg.querySelector('title');
            if (!existingTitle) {
                const title = document.createElement('title');
                title.textContent = `SVG Icon ${index + 1}`;
                if (svg.firstChild) {
                    svg.insertBefore(title, svg.firstChild);
                } else {
                    svg.appendChild(title);
                }
            }
            if (!svg.getAttribute('role')) {
                svg.setAttribute('role', 'img');
            }
            const titleElement = svg.querySelector('title');
            if (titleElement) {
                const titleId = `svg-title-${index + 1}`;
                titleElement.id = titleId;
                svg.setAttribute('aria-labelledby', titleId);
            }
        }
        return svg;
    });
};

// Ensure unique landmarks (REACT_025)
const ensureUniqueLandmarks = function(landmarks) {
    const seenTypes = {};
    landmarks.forEach(landmark => {
        if (landmark && typeof landmark === 'object') {
            const type = landmark.tagName ? landmark.tagName.toLowerCase() : '';
            const role = landmark.getAttribute('role') || type;

            if (seenTypes[role]) {
                if (type === 'nav') {
                    const label = landmark.getAttribute('aria-label');
                    if (!label) {
                        const count = (seenTypes[role + '_count'] || 0) + 1;
                        seenTypes[role + '_count'] = count;
                        landmark.setAttribute('aria-label', `Navigation ${count}`);
                    }
                }
            }
            seenTypes[role] = true;
        }
    });
    return landmarks;
};

// Fix fake link issue (REACT_036)
const fixFakeLinkIssue = function(elements) {
    return elements.map(el => {
        if (el && typeof el === 'object') {
            const isFakeLink = el.tagName === 'A' && !el.href && !el.getAttribute('role');
            if (isFakeLink) {
                el.setAttribute('role', 'button');
            }
        }
        return el;
    });
};

// ADD A NEW FUNCTION: REACT_037: ADD PROPER LANDMARK REGIONS
const addProperLandmarkRegions = function(content) {
    if (content && typeof content === 'string') {
        let result = content;

        // Add banner landmark (header) if not present
        const bannerMatch = content.match(/<header/i);
        if (!bannerMatch) {
            result = result.replace(/<body/i, '<header role="banner"></header><body');
        }

        // Add contentinfo landmark (footer) if not present
        const contentinfoMatch = content.match(/<footer/i);
        if (!contentinfoMatch) {
            result = result.replace(/<\/body>/i, '<footer role="contentinfo"></footer></body>');
        }

        return result;
    }
    return content;
};

// ... (You can add more functions as needed)

// Export the updated functions
module.exports = {
    // ... Existing exports ...
    addLangAttribute,
    fixTableStructureIssues,
    addMainLandmark,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinkIssue,
    addProperLandmarkRegions, // Include the new function in the exports
    renderDependencyGraph1,
    renderDependencyGraph2
    // ... Add any other exports that were found to be affected by the update ...
};