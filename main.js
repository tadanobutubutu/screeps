// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)
// - REACT_038: Render dependency graphs (DONE: renderDependencyGraph)
// - REACT_039: Add banner and contentinfo landmarks if missing in the content (DONE: addMissingLandmarks)
//
const { dependencyGraphContent, indexContent } = require('./content');

// Add lang attribute to HTML element (REACT_015)
const addLangAttribute = function(html) {
    if (!html || typeof html !== 'string') {
        return html;
    }
    
    // Check if lang attribute already exists
    const hasLangAttr = /<html[^>]*\slang\s*=/gi.test(html);
    
    if (hasLangAttr) {
        // Lang attribute exists, ensure it's properly set
        return html.replace(/<html([^>]*)lang\s*=\s*["'][^"']*["']([^>]*)>/gi, (match, before, after) => {
            if (!/lang\s*=/gi.test(before)) {
                return `<html${before} lang="en"${after}>`;
            }
            return match;
        });
    }
    
    // Add lang attribute to existing html tag
    if (/<html/gi.test(html)) {
        return html.replace(/<html([^>]*)>/gi, (match, attrs) => {
            return `<html lang="en"${attrs}>`;
        });
    }
    
    // Wrap content with proper HTML structure if no html tag exists
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${html}</body></html>`;
};

// Fix table structure issues (REACT_027)
const fixTableStructureIssues = function(tables) {
    if (!tables || !Array.isArray(tables)) {
        return tables;
    }
    
    return tables.map((table, index) => {
        if (!table || typeof table !== 'string') {
            return table;
        }
        
        let fixedTable = table;
        
        // Add thead if table has header rows but no thead
        const hasHeaderRow = /<th[^>]*>/gi.test(fixedTable);
        const hasThead = /<thead/gi.test(fixedTable);
        
        if (hasHeaderRow && !hasThead) {
            // Find first tr and wrap headers in thead
            fixedTable = fixedTable.replace(/(<tr[^>]*>[\s\S]*?)<table/gi, '<table');
        }
        
        // Add tbody if missing (tables should have tbody for dynamic content)
        const hasTbody = /<tbody/gi.test(fixedTable);
        if (!hasTbody) {
            fixedTable = fixedTable.replace(/(<\/thead>)/gi, '$1<tbody>');
            // Close tbody before closing table
            if (!/<tbody>[\s\S]*<\/tbody>/gi.test(fixedTable)) {
                fixedTable = fixedTable.replace(/(<\/table>)/gi, '</tbody>$1');
            }
        }
        
        // Add caption if table is complex (has multiple rows)
        const rowCount = (fixedTable.match(/<tr/gi) || []).length;
        if (rowCount > 3 && !/<caption/gi.test(fixedTable)) {
            fixedTable = fixedTable.replace(/<table/gi, '<table><caption>Table ' + (index + 1) + '</caption');
        }
        
        // Ensure proper th scope attributes for accessibility
        fixedTable = fixedTable.replace(/<th([^>]*)>/gi, (match, attrs) => {
            if (!/scope/gi.test(attrs)) {
                return `<th${attrs} scope="col">`;
            }
            return match;
        });
        
        return fixedTable;
    });
};

// Add main landmark (REACT_017)
const addMainLandmark = function(content) {
    if (!content || typeof content !== 'string') {
        return content;
    }
    
    // Check if main element already exists
    const hasMainElement = /<main/gi.test(content);
    
    if (hasMainElement) {
        // Ensure it's properly formatted with the main landmark role
        return content.replace(/<main([^>]*)>/gi, (match, attrs) => {
            if (!/role\s*=\s*["']main["']/gi.test(attrs)) {
                return `<main${attrs} role="main">`;
            }
            return match;
        });
    }
    
    // Find the body tag and insert main landmark after opening body tag
    const bodyMatch = content.match(/<body[^>]*>/i);
    if (bodyMatch) {
        const insertPosition = bodyMatch.index + bodyMatch[0].length;
        return content.slice(0, insertPosition) + '\n<main role="main">' + content.slice(insertPosition);
    }
    
    // If no body tag, wrap content with main landmark
    return '<main role="main">' + content + '</main>';
};

// Add accessible names to SVGs (REACT_041)
const addSvgAccessibleNames = function(svgs) {
    if (!svgs || !Array.isArray(svgs)) {
        return svgs;
    }
    
    return svgs.map((svg, index) => {
        if (!svg || typeof svg !== 'string') {
            return svg;
        }
        
        let fixedSvg = svg;
        
        // Check if svg has a title element (first child should be title)
        const hasTitle = /<title/gi.test(fixedSvg);
        
        if (!hasTitle) {
            // Add a title as the first child for accessible name
            const titleText = `SVG Icon ${index + 1}`;
            fixedSvg = fixedSvg.replace(/<svg/i, `<svg><title>${titleText}</title>`);
        }
        
        // Add aria-label if noaria-labelledby or aria-label exists
        const hasAriaLabel = /aria-label/gi.test(fixedSvg);
        const hasAriaLabelledby = /aria-labelledby/gi.test(fixedSvg);
        
        if (!hasAriaLabel && !hasAriaLabelledby) {
            fixedSvg = fixedSvg.replace(/<svg([^>]*)>/i, (match, attrs) => {
                return `<svg${attrs} role="img" aria-label="SVG Icon ${index + 1}">`;
            });
        }
        
        return fixedSvg;
    });
};

// Ensure unique landmarks (REACT_025)
const ensureUniqueLandmarks = function(landmarks) {
    if (!landmarks || !Array.isArray(landmarks)) {
        return landmarks;
    }
    
    const seenTypes = {};
    
    return landmarks.filter(landmark => {
        if (!landmark || typeof landmark !== 'string') {
            return false;
        }
        
        // Extract landmark type from the landmark element
        const landmarkMatch = landmark.match(/<(header|footer|main|nav|aside|section|article)[^>]*>/i);
        if (landmarkMatch) {
            const type = landmarkMatch[1].toLowerCase();
            
            // For multiple instances of same landmark type, keep the first one only
            if (seenTypes[type]) {
                return false;
            }
            seenTypes[type] = true;
        }
        
        return true;
    });
};

// Fix fake link issue (REACT_036)
const fixFakeLinkIssue = function(elements) {
    if (!elements || !Array.isArray(elements)) {
        return elements;
    }
    
    return elements.map(element => {
        if (!element || typeof element !== 'string') {
            return element;
        }
        
        let fixedElement = element;
        
        // Check if this is a fake link (div or span with onClick or href but no anchor)
        const isFakeLink = /^<(div|span)[^>]*onClick[^>]*>/i.test(fixedElement) ||
                          /^<(div|span)[^>]*href[^>]*>/i.test(fixedElement);
        
        if (isFakeLink) {
            // Convert to proper button if it looks like a link
            if (/onClick/gi.test(fixedElement) || /href/gi.test(fixedElement)) {
                // Add proper role and tabindex for accessibility
                fixedElement = fixedElement.replace(/<(div|span)([^>]*)>/i, (match, tag, attrs) => {
                    return `<${tag}${attrs} role="button" tabindex="0">`;
                });
            }
        }
        
        return fixedElement;
    });
};

// ADD A NEW FUNCTION: REACT_037: ADD PROPER LANDMARK REGIONS
const addProperLandmarkRegions = function(content) {
    if (content && typeof content === 'string') {
        let result = content;

        // Add banner landmark (header) if not present
        if (!/<header/gi.test(result)) {
            const bodyMatch = result.match(/<body[^>]*>/i);
            if (bodyMatch) {
                const insertPos = bodyMatch.index + bodyMatch[0].length;
                result = result.slice(0, insertPos) + '\n<header role="banner"></header>' + result.slice(insertPos);
            } else {
                result = '<header role="banner"></header>' + result;
            }
        }

        // Add contentinfo landmark (footer) if not present
        if (!/<footer/gi.test(result)) {
            result = result.replace(/<\/body>/gi, '<footer role="contentinfo"></footer></body>');
            if (!/<footer/gi.test(result)) {
                result = result + '\n<footer role="contentinfo"></footer>';
            }
        }

        return result;
    }
    return content;
};

// ADD A NEW FUNCTION: REACT_038: RENDER DEPENDENCY GRAP