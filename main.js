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

// REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
    return document.documentElement.lang || 'en';
}

// REACT_027: Fix table structure issues
function validateTableAccessibility() {
    const tables = document.querySelectorAll('table');
    let issues = 0;
    
    tables.forEach(table => {
        const headers = table.querySelectorAll('th');
        const hasCaption = table.querySelector('caption');
        
        if (headers.length === 0) {
            issues++;
            console.warn('Table missing header cells (th)');
        }
        
        if (!hasCaption) {
            issues++;
            console.warn('Table missing caption for accessibility');
        }
    });
    
    return issues === 0;
}

function validateTableStructure() {
    const tables = document.querySelectorAll('table');
    let issues = 0;
    
    tables.forEach(table => {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td, th');
            if (cells.length === 0) {
                issues++;
            }
        });
    });
    
    if (issues > 0) {
        console.warn(`Found ${issues} table structure issues`);
    }
    return issues === 0;
}

// REACT_017: Add/fix landmark issues
function validateLandmark() {
    const landmarks = document.querySelectorAll('header, main, footer, nav, aside');
    if (landmarks.length === 0) {
        console.warn('No landmark regions found');
        return false;
    }
    return true;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
    const landmarkSelectors = ['header', 'main', 'footer'];
    let valid = true;
    
    landmarkSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 1) {
            console.warn(`Multiple ${selector} elements found. Consider using aria-label for uniqueness.`);
            valid = false;
        }
    });
    
    return valid;
}

// REACT_041: Add accessible names to SVGs
function getSvgAccessibleName(svgElement) {
    const titleElement = svgElement.querySelector('title');
    if (titleElement) {
        return titleElement.textContent;
    }
    
    const ariaLabel = svgElement.getAttribute('aria-label');
    if (ariaLabel) {
        return ariaLabel;
    }
    
    return null;
}

function setSvgAttributes(svgElement, accessibleName) {
    if (!svgElement || !accessibleName) {
        return false;
    }
    
    // Check if title exists, if not create one
    let titleElement = svgElement.querySelector('title');
    if (!titleElement) {
        titleElement = document.createElement('title');
        svgElement.insertBefore(titleElement, svgElement.firstChild);
    }
    titleElement.textContent = accessibleName;
    
    // Set ARIA attributes
    svgElement.setAttribute('role', 'img');
    svgElement.setAttribute('aria-label', accessibleName);
    
    return true;
}

// REACT_036: Fix fake link issues
function validateLinkAccessibility() {
    const links = document.querySelectorAll('a');
    let issues = 0;
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href === '#') {
            const text = link.textContent.trim();
            if (!text) {
                issues++;
                console.warn('Fake link found without accessible name');
            }
        }
    });
    
    return issues === 0;
}

function handleFakeLinks() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href === '#') {
            link.setAttribute('role', 'button');
            if (!link.getAttribute('tabindex')) {
                link.setAttribute('tabindex', '0');
            }
        }
    });
}

// Preserve any existing exports here
export { createInPageButton, validateLandmarkStructure };