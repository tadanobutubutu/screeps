// Existing code from main.js
// TODO: Implement function for addressing accessibility issues from insight report
// Placeholder for the new function

function addressAccessibilityIssues(insightReport) {
    // Implement the logic to address accessibility issues based on the insight report
    // This is a placeholder for the actual implementation
    console.log('Addressing accessibility issues:', insightReport);
}

// Export the new function if necessary
// For example, if the function is meant to be used outside of this file:
export { addressAccessibilityIssues };

// New function: wrapPrimaryContentInMain
// This function identifies the primary content of a page and wraps it in a <main> element
// to improve accessibility compliance
function wrapPrimaryContentInMain() {
    // Check if a <main> element already exists
    const existingMain = document.querySelector('main');
    if (existingMain) {
        console.log('Primary content is already wrapped in a <main> element');
        return existingMain;
    }

    // Identify potential primary content elements
    const primarySelectors = [
        '[role="main"]',
        '#main-content',
        '#main',
        '.main-content',
        '.main',
        'article',
        '.content',
        '#content'
    ];

    let primaryContent = null;

    // Find the first matching selector
    for (const selector of primarySelectors) {
        const element = document.querySelector(selector);
        if (element) {
            primaryContent = element;
            break;
        }
    }

    // If no primary content found, try to use the largest content block
    if (!primaryContent) {
        const body = document.body;
        const children = Array.from(body.children);
        
        // Find the element with the most text content
        primaryContent = children.reduce((largest, element) => {
            const currentText = element.textContent.trim().length;
            const largestText = largest ? largest.textContent.trim().length : 0;
            return currentText > largestText ? element : largest;
        }, null);
    }

    // If primary content is found, wrap it in a <main> element
    if (primaryContent) {
        const mainElement = document.createElement('main');
        
        // Copy inline styles if they exist
        if (primaryContent.style.cssText) {
            mainElement.style.cssText = primaryContent.style.cssText;
        }
        
        // Copy classes
        if (primaryContent.className) {
            mainElement.className = primaryContent.className;
        }
        
        // Insert the <main> element before the primary content
        primaryContent.parentNode.insertBefore(mainElement, primaryContent);
        
        // Move the primary content inside the <main> element
        mainElement.appendChild(primaryContent);
        
        console.log('Successfully wrapped primary content in <main> element');
        return mainElement;
    }

    console.log('No primary content found to wrap');
    return null;
}

// Export wrapPrimaryContentInMain for external use
export { wrapPrimaryContentInMain };

// REACT_015: Add lang attribute to HTML element
function addLangAttribute(lang = 'en') {
    const html = document.documentElement;
    if (!html.hasAttribute('lang')) {
        html.setAttribute('lang', lang);
        console.log('Added lang attribute to HTML element:', lang);
        return true;
    }
    console.log('HTML element already has lang attribute');
    return false;
}

// Export for external use
export { addLangAttribute };

// REACT_017 & REACT_025: Fix landmark issues and ensure unique landmarks
function ensureUniqueLandmarks() {
    const landmarks = {
        main: document.querySelectorAll('main'),
        nav: document.querySelectorAll('nav'),
        header: document.querySelectorAll('header'),
        footer: document.querySelectorAll('footer'),
        aside: document.querySelectorAll('aside'),
        search: document.querySelectorAll('[role="search"]')
    };
    
    const results = { fixed: [], skipped: [] };
    
    // Ensure only one main element (wrap additional ones if found)
    if (landmarks.main.length > 1) {
        for (let i = 1; i < landmarks.main.length; i++) {
            const extraMain = landmarks.main[i];
            const section = document.createElement('section');
            section.setAttribute('aria-label', 'Additional content section');
            
            // Wrap the extra main content in a section
            extraMain.parentNode.insertBefore(section, extraMain);
            while (extraMain.firstChild) {
                section.appendChild(extraMain.firstChild);
            }
            extraMain.remove();
            results.fixed.push('Wrapped extra <main> element in <section>');
        }
    }
    
    // Ensure multiple nav elements have unique labels
    landmarks.nav.forEach((nav, index) => {
        if (landmarks.nav.length > 1 && !nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
            const label = `Navigation ${index + 1}`;
            nav.setAttribute('aria-label', label);
            results.fixed.push(`Added aria-label to nav: "${label}"`);
        }
    });
    
    // Ensure header and footer are unique if they appear multiple times
    if (landmarks.header.length > 1) {
        landmarks.header.forEach((header, index) => {
            if (!header.hasAttribute('aria-label') && !header.hasAttribute('aria-labelledby')) {
                const label = `Header ${index + 1}`;
                header.setAttribute('aria-label', label);
                results.fixed.push(`Added aria-label to header: "${label}"`);
            }
        });
    }
    
    if (landmarks.footer.length > 1) {
        landmarks.footer.forEach((footer, index) => {
            if (!footer.hasAttribute('aria-label') && !footer.hasAttribute('aria-labelledby')) {
                const label = `Footer ${index + 1}`;
                footer.setAttribute('aria-label', label);
                results.fixed.push(`Added aria-label to footer: "${label}"`);
            }
        });
    }
    
    console.log('Landmark uniqueness check complete:', results);
    return results;
}

// Export for external use
export { ensureUniqueLandmarks };

// REACT_036: Fix fake link issues
function fixFakeLinks() {
    // Find links with href="#" or href="javascript:void(0)" or empty href
    const fakeLinkSelectors = [
        'a[href="#"]',
        'a[href="javascript:void(0)"]',
        'a[href="javascript:void(0);"]',
        'a[href=""]'
    ];
    
    const results = { fixed: [], skipped: [] };
    
    fakeLinkSelectors.forEach(selector => {
        const fakeLinks = document.querySelectorAll(selector);
        fakeLinks.forEach(link => {
            // Check if the link has an onclick handler or looks like a button
            const isButtonLike = link.getAttribute('role') === 'button' || 
                                 link.onclick !== null ||
                                 link.classList.contains('btn') ||
                                 link.classList.contains('button') ||
                                 link.tagName === 'BUTTON';
            
            if (isButtonLike || link.textContent.toLowerCase().includes('click')) {
                // Convert to button
                const button = document.createElement('button');
                button.innerHTML = link.innerHTML;
                
                // Copy attributes except href
                Array.from(link.attributes).forEach(attr => {
                    if (attr.name !== 'href') {
                        button.setAttribute(attr.name, attr.value);
                    }
                });
                
                // Copy inline styles and classes
                if (link.style.cssText) {
                    button.style.cssText = link.style.cssText;
                }
                
                // Replace link with button
                link.parentNode.replaceChild(button, link);
                results.fixed.push('Converted fake link to button');
            } else {
                // Make it accessible - add proper attributes
                link.setAttribute('href', '#main-content');
                link.setAttribute('aria-disabled', 'true');
                results.skipped.push('Updated fake link with accessibility attributes');
            }
        });
    });
    
    console.log('Fake link fix complete:', results);
    return results;
}

// Export for external use
export { fixFakeLinks };

// Main function to address all accessibility issues from insight report
function addressInsightReportAccessibilityIssues(options = {}) {
    const lang = options.lang || 'en';
    const results = {
        lang: null,
        landmarks: null,
        fakeLinks: null,
        main: null
    };
    
    // REACT_015: Add lang attribute
    results.lang = addLangAttribute(lang);
    
    // REACT_017 & REACT_025: Fix landmark issues
    results.landmarks = ensureUniqueLandmarks();
    
    // REACT_036: Fix fake links
    results.fakeLinks = fixFakeLinks();
    
    // Wrap primary content in main element if needed
    results.main = wrapPrimaryContentInMain();
    
    console.log('All accessibility issues addressed:', results);
    return results;
}

// Export the main accessibility function
export { addressInsightReportAccessibilityIssues };