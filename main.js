// TODO: This is the existing code that needs to be preserved
// _Commit: 243c66538868c6b87845660312397ab39e0f830d_
// <!-- todo-hash: ... -->

// TODO: Implement logic to retrieve the current language setting
function getCurrentLanguage() {
    return navigator.language || navigator.userLanguage;
}

// TODO: Implement this function for creating in-page buttons
function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    return button;
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

// Function to check link accessibility
function isLinkAccessible() {
    const links = document.querySelectorAll('a[href]');
    const inaccessibleLinks = [];

    links.forEach(link => {
        const href = link.getAttribute('href');

        // Skip empty links and anchor links
        if (!href || href.startsWith('#') || href.startsWith('javascript:')) {
            return;
        }

        // Check if link has valid href
        if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('/')) {
            inaccessibleLinks.push({
                text: link.textContent.trim() || href,
                href: href,
                reason: 'Invalid or incomplete URL'
            });
        }
    });

    if (inaccessibleLinks.length > 0) {
        console.warn(`Warning: Found ${inaccessibleLinks.length} potentially inaccessible links`);
        inaccessibleLinks.forEach(link => {
            console.warn(`  - ${link.text} (${link.href}): ${link.reason}`);
        });
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

// Preserve any existing exports here
export { createInPageButton, validateLandmarkStructure, isLinkAccessible };