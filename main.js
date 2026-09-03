// TODO: Add back any required exports that might have been removed
// TODO: This is the existing code that needs to be preserved
//_Commit: 243c66538868c6b87845660312397ab39e0f830d_
//<!-- todo-hash: ... -->

// TODO: add the new functions or changes requested in the issue
// Here is the implementation for checking link accessibility
function checkLinkAccessibility() {
    const issues = [];
    const links = document.querySelectorAll('a[href]');
    
    links.forEach((link, index) => {
        const href = link.getAttribute('href');
        const text = link.textContent.trim();
        
        // Check for empty href
        if (!href || href === '' || href === '#') {
            issues.push({
                index,
                type: 'empty_href',
                message: `Link at index ${index} has an empty or invalid href`,
                element: link
            });
        }
        
        // Check for JavaScript hrefs
        if (href && (href.startsWith('javascript:') || href === 'javascript:void(0)')) {
            issues.push({
                index,
                type: 'javascript_href',
                message: `Link at index ${index} uses JavaScript href which may not be accessible`,
                element: link
            });
        }
        
        // Check for generic link text
        const genericTexts = ['click here', 'here', 'read more', 'more', 'link', 'learn more'];
        if (genericTexts.includes(text.toLowerCase())) {
            issues.push({
                index,
                type: 'generic_text',
                message: `Link at index ${index} has generic accessible text: "${text}"`,
                element: link
            });
        }
        
        // Check for missing accessible text
        if (!text || text.length === 0) {
            const ariaLabel = link.getAttribute('aria-label');
            const title = link.getAttribute('title');
            if (!ariaLabel && !title) {
                issues.push({
                    index,
                    type: 'missing_text',
                    message: `Link at index ${index} has no accessible text`,
                    element: link
                });
            }
        }
    });
    
    if (issues.length > 0) {
        console.warn(`Link accessibility issues found: ${issues.length}`);
        issues.forEach(issue => {
            console.warn(`- ${issue.message}`);
        });
    }
    
    return {
        isValid: issues.length === 0,
        issues
    };
}

// Function to validate landmark structure for accessibility issues
function validateLandmarkStructure() {
    const requiredLandmarks = ['header', 'main', 'footer'];
    const missingLandmarks = [];

    requiredLandmarks.forEach(landmark => {
        const element = document.querySelector(landmark);
        if (!element) {
            missingLandmarks.push(landmark);
        }
    });

    if (missingLandmarks.length > 0) {
        console.warn(`Warning: Missing required landmarks: ${missingLandmarks.join(', ')}`);
        return false;
    }

    return true;
}

// New function for rendering graph/index
function renderGraphIndex(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id '${containerId}' not found`);
        return false;
    }

    const graphElement = document.createElement('div');
    graphElement.className = 'graph-index';
    graphElement.innerHTML = '<h2>Dependency Graph</h2>';

    if (data && data.dependencies) {
        const list = document.createElement('ul');
        data.dependencies.forEach(dep => {
            const li = document.createElement('li');
            li.textContent = `${dep.name} - ${dep.version}`;
            list.appendChild(li);
        });
        graphElement.appendChild(list);
    }

    container.appendChild(graphElement);
    return true;
}

// TODO: Update the existing function using the new functions for rendering graph/index
function renderDependencyGraph(containerId, graphData) {
    return renderGraphIndex(containerId, graphData);
}

// Implement this function for creating in-page buttons
function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    return button;
}

// Preserve any existing exports here
// export { existingFunction1, existingFunction2, ... };