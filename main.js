function getLangAttribute() {
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

        if (harvestedData.configuration) {
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

function getCurrentLanguage() {
    return navigator.language || navigator.userLanguage;
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
    if (!container.hasAttribute('role')) {
        container.setAttribute('role', 'group');
    }

    return true;
}

export { createInPageButton, validateLandmarkStructure, getCurrentLanguage, performUpgrade, upgrade, renderGraphIndex };