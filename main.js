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

// TODO: Implement upgrade logic
function upgrade(currentVersion, previousVersion) {
    if (!previousVersion) {
        console.log('First installation, no upgrade needed');
        return true;
    }

    const currentParts = currentVersion.split('.').map(Number);
    const previousParts = previousVersion.split('.').map(Number);

    for (let i = 0; i < Math.max(currentParts.length, previousParts.length); i++) {
        const currentPart = currentParts[i] || 0;
        const previousPart = previousParts[i] || 0;

        if (currentPart > previousPart) {
            console.log(`Upgrading from version ${previousVersion} to ${currentVersion}`);
            performUpgradeTasks(previousVersion, currentVersion);
            return true;
        } else if (currentPart < previousPart) {
            console.warn(`Downgrade detected from ${previousVersion} to ${currentVersion}`);
            return false;
        }
    }

    console.log('Version unchanged, no upgrade needed');
    return true;
}

function performUpgradeTasks(fromVersion, toVersion) {
    // Clear old cached data
    if (typeof localStorage !== 'undefined') {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('legacy_')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }

    // Update stored version
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('app_version', toVersion);
    }

    console.log(`Upgrade tasks completed: ${fromVersion} -> ${toVersion}`);
}

// Preserve any existing exports here
export { createInPageButton, validateLandmarkStructure };