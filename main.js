module.exports = function() {
    // Initialize accessibility features
    const langAttr = getLangAttribute();
    const primaryContent = wrapPrimaryContentInMain();

    // Validate accessibility
    validateTableAccessibility();
    validateTableStructure();
    validateLandmark();
    validateLandmarkStructure();
    addFixLandmarkIssues();

    // SVG accessibility
    const svgName = getSvgAccessibleName();
    addAriaToFormControls();

    // Unique landmarks and fake link fixes
    ensureUniqueLandmarks();
    fixFakeLinkIssues();
    createAccessibleLink();

    // Create in-page buttons
    createInPageButtons();

    // Harvest and upgrade logic
    const creeps = Game.creeps;
    const sources = Game.sources;
    const controller = Game.controllers[0]; // assuming first controller

    Object.values(creeps).forEach(creep => {
        const source = creep.findClosestByPath(FIND_SOURCES, {
            filter: (source) => source.energy > 0
        });
        if (source) {
            harvest(creep, source);
        } else {
            upgradeController(creep, controller);
        }
    });

    // New: Check link accessibility
    checkLinkAccessibility();
};

function createInPageButtons() {
    const doc = getDocument();
    if (!doc) return;
    
    // Create a navigation container for in-page buttons
    const navContainer = doc.createElement('nav');
    navContainer.setAttribute('aria-label', 'In-page navigation');
    navContainer.id = 'in-page-buttons';
    navContainer.style.cssText = 'position:fixed;bottom:10px;right:10px;z-index:9999;';
    
    // Create skip to content button
    const skipButton = doc.createElement('button');
    skipButton.setAttribute('type', 'button');
    skipButton.setAttribute('aria-label', 'Skip to main content');
    skipButton.textContent = 'Skip to Content';
    skipButton.className = 'in-page-btn in-page-btn--skip';
    skipButton.addEventListener('click', function() {
        const main = doc.querySelector('main') || doc.querySelector('[role="main"]') || doc.body.firstElementChild;
        if (main && typeof main.focus === 'function') {
            main.setAttribute('tabindex', '-1');
            main.focus();
        }
    });
    
    // Create back to top button
    const topButton = doc.createElement('button');
    topButton.setAttribute('type', 'button');
    topButton.setAttribute('aria-label', 'Return to top of page');
    topButton.textContent = 'Top';
    topButton.className = 'in-page-btn in-page-btn--top';
    topButton.addEventListener('click', function() {
        if (typeof window !== 'undefined' && window.scrollTo) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    
    // Append buttons to container
    navContainer.appendChild(skipButton);
    navContainer.appendChild(topButton);
    
    // Add container to document
    if (doc.body) {
        doc.body.appendChild(navContainer);
    } else {
        doc.appendChild(navContainer);
    }
    
    return navContainer;
}

function checkLinkAccessibility() {
    const doc = getDocument();
    if (doc) {
        const links = doc.querySelectorAll('a');
        let issues = [];
        links.forEach(link => {
            if (!link.textContent && !link.getAttribute('aria-label')) {
                issues.push('Link missing accessible name');
            }
        });
        return issues.length === 0;
    }
}

function addressAccessibilityIssues(doc) {
    if (!doc || !doc.documentElement) {
        // Fallback for environment without document (e.g., test environment)
        return;
    }

    // ... existing code ...
}

function getDocument() {
    if (typeof document !== 'undefined') {
        return document;
    }
    return null;
}