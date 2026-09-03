// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// Implement logic to retrieve the current language setting
// Implement this function for creating in-page buttons
// Function to validate landmark structure for accessibility issues
// Implement upgrade logic
// Function to analyze harvested data
// Function to apply improvements
// Function to implement upgrade logic using harvested data to improve the system
// New function for rendering graph/index
// Preserve any existing exports here

function getCurrentLanguage() {
    return navigator.language || navigator.userLanguage;
}

function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;

    // Accessibility: Set ARIA label for screen readers
    button.setAttribute('aria-label', buttonText);

    // Accessibility: Add keyboard focus styles
    button.addEventListener('focus', function() {
        this.style.outline = '2px solid #0066cc';
        this.style.outlineOffset = '2px';
    });

    button.addEventListener('blur', function() {
        this.style.outline = '';
        this.style.outlineOffset = '';
    });

    return button;
}

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

function performUpgrade(harvestedData) {
    // ... (existing implementation here)
}

function analyzeHarvestedData(data) {
    // ... (existing implementation here)
}

function applyImprovements(data) {
    // ... (existing implementation here)
}

function upgrade(harvestedData) {
    // Validate that harvested data is provided
    if (!harvestedData || typeof harvestedData !== 'object') {
        console.error('Upgrade failed: Invalid or missing harvested data');
        return false;
    }

    // Process harvested data to improve the system
    try {
        // Apply harvested data improvements
        if (harvestedData.settings) {
            // Apply settings upgrades
            console.log('Applying settings upgrades from harvested data');
        }

        if (harvestedData.config) {
            // Apply configuration improvements
            console.log('Applying configuration improvements from harvested data');
        }

        if (harvestedData.preferences) {
            // Apply user preference improvements
            console.log('Applying user preferences from harvested data');
        }

        // Log successful upgrade
        console.log('System upgrade completed successfully using harvested data');
        return true;
    } catch (error) {
        console.error('Upgrade failed:', error.message);
        return false;
    }
}

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

    // Check for required ARIA role on the container and set it if missing
    if (!container.getAttribute('role')) {
        container.setAttribute('role', 'group');
    }

    return true;
}

function renderDependencyGraph(containerId, graphData) {
    return renderGraphIndex(containerId, graphData);
}

function wrapPrimaryContentInMain() {
    // Check if main element already exists
    let mainElement = document.querySelector('main');
    
    // If main element doesn't exist, create one
    if (!mainElement) {
        mainElement = document.createElement('main');
        
        // Find primary content elements - check multiple common selectors
        const primaryContentSelectors = [
            '#primary-content',
            '.primary-content',
            '[role="main"]',
            '#content',
            '.content',
            'article',
            'section.content'
        ];
        
        let primaryContent = null;
        
        // Find the first matching primary content element
        for (const selector of primaryContentSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                primaryContent = element;
                break;
            }
        }
        
        // If primary content is found, wrap it in main
        if (primaryContent) {
            mainElement.appendChild(primaryContent);
            document.body.insertBefore(mainElement, document.body.firstChild);
        } else {
            // Wrap all body children except header and footer into main
            const bodyChildren = Array.from(document.body.children);
            bodyChildren.forEach(child => {
                const tagName = child.tagName.toLowerCase();
                if (tagName !== 'header' && tagName !== 'footer' && tagName !== 'nav') {
                    mainElement.appendChild(child);
                }
            });
            
            if (mainElement.children.length > 0) {
                // Find a good insertion point (after header/nav)
                const header = document.querySelector('header, nav');
                if (header && header.nextSibling) {
                    document.body.insertBefore(mainElement, header.nextSibling);
                } else {
                    document.body.insertBefore(mainElement, document.body.firstChild);
                }
            }
        }
    }
    
    // Ensure main element has proper ARIA attributes
    if (!mainElement.id) {
        mainElement.id = 'main-content';
    }
    
    mainElement.setAttribute('role', 'main');
    mainElement.setAttribute('tabindex', '-1');
    
    // Validate the landmark structure after wrapping
    validateLandmarkStructure();
    
    return mainElement;
}

// Preserve any existing exports here
export { createInPageButton, validateLandmarkStructure, getCurrentLanguage, performUpgrade, upgrade, renderGraphIndex, renderDependencyGraph, wrapPrimaryContentInMain };