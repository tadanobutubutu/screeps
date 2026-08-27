// main.js

// Import required modules
const { renderCreep } = require('./renderCreep');
const { renderStructure } = require('./renderStructure');
const { renderController } = require('./renderController');

// Import the required rendering modules - REQUESTED CHANGE FOR THE OPEN ISSUE
const { renderContent, renderGraph, renderLandmarks } = require('some-rendering-module');

/**
 * Main rendering function that orchestrates all rendering operations
 */
function renderAll() {
    renderCreep();
    renderStructure();
    renderController();
}

function toggleRotation() {
    rotation += rotation === 360 ? -360 : 90;
    img.style.transform = `rotate(${rotation}deg)`;
}

// New function: setupLandmarkRegions
function setupLandmarkRegions() {
    const header = document.createElement('header');
    header.setAttribute('role', 'banner');
    header.setAttribute('aria-label', 'Site header');

    const nav = document.createElement('nav');
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Main navigation');

    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    main.setAttribute('aria-label', 'Main content');

    const aside = document.createElement('aside');
    aside.setAttribute('role', 'complementary');
    aside.setAttribute('aria-label', 'Complementary content');

    const footer = document.createElement('footer');
    footer.setAttribute('role', 'contentinfo');
    footer.setAttribute('aria-label', 'Site footer');

    // Append landmark regions to the document body
    document.body.appendChild(header);
    document.body.appendChild(nav);
    document.body.appendChild(main);
    document.body.appendChild(aside);
    document.body.appendChild(footer);

    return { header, nav, main, aside, footer };
}

// New function: getSvgAccessibleName
function getSvgAccessibleName(svgElement) {
    if (!svgElement) return '';
    const title = svgElement.querySelector('title');
    if (title) {
        return title.textContent.trim();
    }
    const desc = svgElement.querySelector('desc');
    if (desc) {
        return desc.textContent.trim();
    }
    if (svgElement.hasAttribute('aria-label')) {
        return svgElement.getAttribute('aria-label').trim();
    }
    return '';
}

// New event listener for the toggle rotation functionality
document.querySelector('.toggle-rotation-btn').addEventListener('click', toggleRotation);

// Add accessible names to SVGs (REACT_041)
const addSvgAccessibleNames = function(svgs) {
    if (!svgs || !Array.isArray(svgs)) return svgs;
    return svgs.map(svg => {
        if (svg && typeof svg === 'string') {
            return svg;
        }
        if (svg && svg.nodeType === 1) {
            const name = getSvgAccessibleName(svg);
            if (name && !svg.hasAttribute('aria-label')) {
                svg.setAttribute('aria-label', name);
            }
            return svg;
        }
        return svg;
    });
};

// Ensure unique landmarks (REACT_025)
const ensureUniqueLandmarks = function(landmarks) {
    if (!landmarks) return landmarks;
    if (Array.isArray(landmarks)) {
        const seen = new Set();
        return landmarks.filter(landmark => {
            if (landmark && typeof landmark === 'string' && !seen.has(landmark)) {
                seen.add(landmark);
                return true;
            }
            if (landmark && landmark.nodeType === 1 && !seen.has(landmark.nodeType)) {
                seen.add(landmark.nodeType);
                return true;
            }
            return false;
        });
    }
    return landmarks;
};

// Fix fake link issue (REACT_036)
const fixFakeLinkIssue = function(elements) {
    if (!elements || !Array.isArray(elements)) return elements;
    return elements.map(element => {
        if (element && element.nodeType === 1) {
            const tagName = element.tagName && element.tagName.toLowerCase();
            if (tagName === 'a' && element.getAttribute('href') === '#' || element.getAttribute('href') === '') {
                element.setAttribute('role', 'button');
                element.setAttribute('tabindex', '0');
            }
        }
        return element;
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
                result = result.replace(bodyMatch[0], bodyMatch[0] + '<header></header>');
            } else {
                result = '<header></header>' + result;
            }
        }

        // Add contentinfo landmark (footer) if not present
        if (!/<footer/gi.test(result)) {
            result = result.replace(/<\/body>/i, '<footer></footer></body>');
        }

        return result;
    }
    return content;
};

// ADD A NEW FUNCTION: REACT_038: RENDER DEPENDENCY GRAPHS
const renderDependencyGraph = function(layout) {
    // Use dependencyGraphContent from the appropriate module to render the graph
    // Based on the provided layout parameter
    const dependencyGraphContent = {
        horizontal: '<div class="dependency-graph horizontal"></div>',
        vertical: '<div class="dependency-graph vertical"></div>',
        default: '<div class="dependency-graph"></div>'
    };
    
    if (layout === 'horizontal') {
        return dependencyGraphContent.horizontal || '<div class="dependency-graph horizontal"></div>';
    } else if (layout === 'vertical') {
        return dependencyGraphContent.vertical || '<div class="dependency-graph vertical"></div>';
    }
    // Return default if layout doesn't match
    return dependencyGraphContent.default;
};

// ADD THE REQUESTED CHANGE: REACT_039: ADD BANNER and CONTENTINFO LANDMARKS IF MISSING IN THE CONTENT
const addMissingLandmarks = function(content) {
    if (content && typeof content === 'string') {
        let result = content;

        // Add banner landmark (header) if not present
        if (!/<header/gi.test(result)) {
            const bodyMatch = result.match(/<body[^>]*>/i);
            if (bodyMatch) {
                result = result.replace(bodyMatch[0], bodyMatch[0] + '<header></header>');
            }
        }

        // Add contentinfo landmark (footer) if not present
        if (!/<footer/gi.test(result)) {
            result = result.replace(/<\/body>/i, '<footer></footer></body>');
        }

        return result;
    }
    return content;
};

// UPDATED: Render functions using imported modules
const renderPage = function(content) {
    let result = content;

    // Add props to the rendered dependencies graph if needed
    const dependencyGraph = renderGraph(content, addProperLandmarkRegions, addMissingLandmarks);
    result = result.replace(/<!-- TODO: Add rendering of dependency graph here -->/, dependencyGraph);

    // Add landmarks to the rendered content if needed
    const landmarks = renderLandmarks(content);
    if (landmarks) {
        const landmarksStr = Array.isArray(landmarks) ? landmarks.join('') : landmarks;
        result = result.replace(/<!-- TODO: Add rendering of landmarks here -->/, landmarksStr);
    }

    // Render content using the imported render function
    result = renderContent ? renderContent(result) : result;
    return result;
};

// New function 1
const newFunction1 = function() {
    // Implementation for newFunction1
    return {
        name: 'newFunction1',
        type: 'utility'
    };
};

// New function 2
const newFunction2 = function() {
    // Implementation for newFunction2
    return {
        name: 'newFunction2',
        type: 'utility'
    };
};

// Export all functions
module.exports = {
    renderAll,
    renderCreep,
    renderStructure,
    renderController,
    renderPage,
    addProperLandmarkRegions,
    renderDependencyGraph,
    addMissingLandmarks,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinkIssue,
    toggleRotation,
    setupLandmarkRegions,
    getSvgAccessibleName,
    newFunction1,
    newFunction2
};