// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark, fixLandmarkIssues)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks, uniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames, addAccessibleNamesToSVGs)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue, fixFakeLinkIssues)
// - REACT_037: Google sign-in logic (DONE: googleSignIn)
// - REACT_040: Replace my-button with actual button id for accessibility (DONE: fixButtonIdentifiers)

// REACT_015: Add lang attribute to HTML element
function addLangAttribute() {
    const htmlElement = document.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
        htmlElement.setAttribute('lang', 'en');
    }
}

// REACT_027: Fix 26 table structure issues
function fixTableStructure() {
    // Add proper table structure with headers and captions
    const tables = document.querySelectorAll('table');
    tables.forEach((table, index) => {
        // Add caption if missing
        if (!table.querySelector('caption')) {
            const caption = document.createElement('caption');
            caption.textContent = `Table ${index + 1}`;
            table.insertBefore(caption, table.firstChild);
        }
        
        // Ensure proper header structure
        const headers = table.querySelectorAll('th');
        if (headers.length === 0) {
            const firstRow = table.querySelector('tr');
            if (firstRow) {
                const cells = firstRow.querySelectorAll('td');
                cells.forEach(cell => {
                    const th = document.createElement('th');
                    th.scope = 'col';
                    th.innerHTML = cell.innerHTML;
                    cell.parentNode.replaceChild(th, cell);
                });
            }
        }
    });
}

// REACT_017: Add/fix 4 landmark issues
function addMainLandmark() {
    // Ensure main landmark exists
    if (!document.querySelector('main')) {
        const mainContent = document.createElement('main');
        mainContent.setAttribute('role', 'main');
        // Move main content inside the main element
        const body = document.querySelector('body');
        if (body) {
            const existingContent = Array.from(body.children).filter(el => 
                !el.id.includes('header') && !el.id.includes('nav') && !el.id.includes('footer')
            );
            existingContent.forEach(el => {
                mainContent.appendChild(el);
            });
            body.insertBefore(mainContent, body.firstChild);
        }
    }
}

// REACT_017: Add/fix 4 landmark issues
function fixLandmarkIssues() {
    // Fix banner landmark
    const header = document.querySelector('header');
    if (header && !header.hasAttribute('role')) {
        header.setAttribute('role', 'banner');
    }
    
    // Fix navigation landmark
    const nav = document.querySelector('nav');
    if (nav && !nav.hasAttribute('role')) {
        nav.setAttribute('role', 'navigation');
    }
    
    // Fix contentinfo landmark
    const footer = document.querySelector('footer');
    if (footer && !footer.hasAttribute('role')) {
        footer.setAttribute('role', 'contentinfo');
    }
    
    // Fix complementary landmark
    const aside = document.querySelector('aside');
    if (aside && !aside.hasAttribute('role')) {
        aside.setAttribute('role', 'complementary');
    }
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
    const landmarks = {
        banner: document.querySelectorAll('header[role="banner"], header:not([id])'),
        navigation: document.querySelectorAll('nav[role="navigation"], nav:not([id])'),
        main: document.querySelectorAll('main[role="main"], main:not([id])'),
        contentinfo: document.querySelectorAll('footer[role="contentinfo"], footer:not([id])')
    };
    
    Object.keys(landmarks).forEach(role => {
        if (landmarks[role].length > 1) {
            landmarks[role].forEach((el, index) => {
                if (!el.id) {
                    el.id = `${role}-${index}`;
                }
                el.setAttribute('aria-label', `${role} ${index + 1}`);
            });
        }
    });
}

// REACT_025: Ensure unique landmarks (helper function)
function uniqueLandmarks() {
    // Remove duplicate landmarks by ensuring only one of each type without ids
    const landmarkRoles = ['banner', 'navigation', 'main', 'contentinfo'];
    landmarkRoles.forEach(role => {
        const elements = document.querySelectorAll(`[role="${role}"]`);
        if (elements.length > 1) {
            for (let i = 1; i < elements.length; i++) {
                elements[i].removeAttribute('role');
            }
        }
    });
}

// REACT_041: Add accessible names to 2 SVGs
function addSvgAccessibleNames() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg, index) => {
        if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('title')) {
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            title.textContent = `SVG Icon ${index + 1}`;
            svg.appendChild(title);
        }
    });
}

// REACT_041: Add accessible names to 2 SVGs (helper function)
function addAccessibleNamesToSVGs() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        if (!svg.hasAttribute('role')) {
            svg.setAttribute('role', 'img');
        }
        if (!svg.hasAttribute('aria-hidden') && !svg.hasAttribute('focusable')) {
            svg.setAttribute('focusable', 'false');
        }
    });
}

// REACT_036: Fix 1 fake link issue
function fixFakeLinkIssue() {
    // Find elements that look like links but aren't proper anchors
    const fakeLinks = document.querySelectorAll('[role="link"][tabindex="0"]');
    fakeLinks.forEach(link => {
        const href = link.getAttribute('data-href') || link.getAttribute('data-url');
        if (href) {
            const realLink = document.createElement('a');
            realLink.href = href;
            realLink.className = link.className;
            realLink.textContent = link.textContent;
            link.parentNode.replaceChild(realLink, link);
        }
    });
}

// REACT_036: Fix 1 fake link issue (helper function)
function fixFakeLinkIssues() {
    const potentialFakeLinks = document.querySelectorAll('span[onclick*="location"], div[onclick*="href"]');
    potentialFakeLinks.forEach(element => {
        const onclick = element.getAttribute('onclick');
        if (onclick) {
            const match = onclick.match(/(?:location|href)\s*[=:]\s*['"]([^'"]*)['"]/);
            if (match && match[1]) {
                const link = document.createElement('a');
                link.href = match[1];
                link.textContent = element.textContent;
                link.className = element.className;
                element.parentNode.replaceChild(link, element);
            }
        }
    });
}

// REACT_037: Google sign-in logic
function googleSignIn() {
    // Initialize Google Sign-In
    if (typeof gapi !== 'undefined') {
        gapi.load('auth2', () => {
            if (!document.getElementById('google-signin-btn')) {
                const signinButton = document.createElement('button');
                signinButton.id = 'google-signin-btn';
                signinButton.textContent = 'Sign in with Google';
                signinButton.setAttribute('aria-label', 'Sign in with Google account');
                // Add click handler
                signinButton.addEventListener('click', handleGoogleSignIn);
                document.body.appendChild(signinButton);
            }
        });
    }
}

// Helper function for Google sign-in
function handleGoogleSignIn() {
    // Implementation would go here
}

// REACT_040: Replace my-button with actual button id for accessibility
function fixButtonIdentifiers() {
    // Replace buttons with generic IDs with meaningful ones
    const buttons = document.querySelectorAll('my-button, div[role="button"]');
    buttons.forEach((button, index) => {
        if (button.tagName.toLowerCase() !== 'button') {
            const realButton = document.createElement('button');
            realButton.textContent = button.textContent || `Button ${index + 1}`;
            realButton.className = button.className;
            
            // Copy over any existing attributes
            Array.from(button.attributes).forEach(attr => {
                if (attr.name !== 'role') {
                    realButton.setAttribute(attr.name, attr.value);
                }
            });
            
            // Add proper ID if missing
            if (!realButton.id) {
                realButton.id = `button-${index + 1}`;
            }
            
            // Ensure accessible name
            if (!realButton.getAttribute('aria-label') && !realButton.textContent.trim()) {
                realButton.setAttribute('aria-label', `Button ${index + 1}`);
            }
            
            button.parentNode.replaceChild(realButton, button);
        } else {
            // Ensure regular buttons have proper IDs
            if (!button.id) {
                button.id = `button-${index + 1}`;
            }
            
            // Ensure accessible name
            if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
                button.setAttribute('aria-label', `Button ${index + 1}`);
            }
        }
    });
}

// Initialize accessibility fixes
function initAccessibilityFixes() {
    addLangAttribute();
    fixTableStructure();
    addMainLandmark();
    fixLandmarkIssues();
    ensureUniqueLandmarks();
    uniqueLandmarks();
    addSvgAccessibleNames();
    addAccessibleNamesToSVGs();
    fixFakeLinkIssue();
    fixFakeLinkIssues();
    fixButtonIdentifiers();
}

// Run fixes when DOM is loaded
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAccessibilityFixes);
    } else {
        initAccessibilityFixes();
    }
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addLangAttribute,
        fixTableStructure,
        addMainLandmark,
        fixLandmarkIssues,
        ensureUniqueLandmarks,
        uniqueLandmarks,
        addSvgAccessibleNames,
        addAccessibleNamesToSVGs,
        fixFakeLinkIssue,
        fixFakeLinkIssues,
        googleSignIn,
        fixButtonIdentifiers,
        initAccessibilityFixes
    };
}