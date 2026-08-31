'use strict';

// ----- BEGIN ORIGINAL CODE (unchanged) -----

// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'
// ...

// BEGIN CHANGES TO ADDRESS ACCESSIBILITY ISSUES

// Landmark elements that should be checked for proper usage
const LANDMARK_ELEMENTS = ['main', 'nav', 'header', 'footer', 'aside', 'section', 'article'];

// Function to add landmark regions ensuring proper IDs
function addLandmarkRegions() {
    const landmarkElements = document.querySelectorAll('main, nav, header, footer, aside, section, article');
    landmarkElements.forEach((landmark, index) => {
        if (landmark && !landmark.id) {
            landmark.id = `${landmark.tagName.toLowerCase()}-${index}`;
        }
    });
}

// New function to check landmark elements
function checkLandmarkElements() {
    const landmarkElements = document.querySelectorAll('main, nav, header, footer, aside, section, article');
    landmarkElements.forEach((landmark) => {
        if (landmark && (!landmark.id || landmark.id === '')) {
            landmark.id = `${landmark.tagName.toLowerCase()}-${Math.floor(Math.random() * 10000)}`;
        }
    });
}

// New function to ensure all landmark elements have unique IDs
function ensureLandmarkUniqueness() {
    const landmarkElements = document.querySelectorAll('main, nav, header, footer, aside, section, article');
    const ids = new Set();
    let hasDuplicate = false;

    landmarkElements.forEach((landmark) => {
        if (landmark) {
            if (!landmark.id) {
                const tagName = landmark.tagName.toLowerCase();
                landmark.id = `${tagName}-${Math.floor(Math.random() * 10000)}`;
            }
            if (ids.has(landmark.id)) {
                hasDuplicate = true;
                const tagName = landmark.tagName.toLowerCase();
                landmark.id = `${tagName}-${Math.floor(Math.random() * 10000)}`;
            }
            ids.add(landmark.id);
        }
    });

    return !hasDuplicate;
}

// New function to initialize accessibility features based on insight report
function initAccessibility() {
    setLangAttribute();

    // REACT_015: Add lang attribute
    setLangAttribute();

    // REACT_025: Add skip link functionality for keyboard users
    const skipLink = document.getElementById('main-content') || document.querySelector('main');
    if (skipLink) {
        skipLink.setAttribute('tabindex', '-1');
        skipLink.addEventListener('focus', function() {
            this.removeAttribute('tabindex');
        });
    }

    // Ensure all interactive elements are keyboard accessible
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    interactiveElements.forEach(function(element) {
        if (!element.getAttribute('tabindex') && !element.hasAttribute('href')) {
            element.setAttribute('tabindex', '0');
        }
    });
}

// Store for accessibility announcements (screen reader support)
const a11yStore = {

    // Existing code

    init() {
        this.setupSkipLinks();
        this.fixFakeLinks(); // Added for REACT_036
        this.setupLiveRegion();
        addLandmarkRegions();
        checkLandmarkElements();
        ensureLandmarkUniqueness();
    },

    setupSkipLinks() {
        if (typeof document === 'undefined') return;
        const skipLink = document.getElementById('skip-link');
        if (skipLink) return;
        const link = document.createElement('a');
        link.href = '#main-content';
        link.textContent = 'Skip to main content';
        link.id = 'skip-link';
        link.style.position = 'absolute';
        link.style.top = '-40px';
        link.style.left = '0';
        link.style.background = '#000';
        link.style.color = '#fff';
        link.style.padding = '8px';
        link.style.zIndex = '100';
        link.style.visibility = 'hidden';
        link.addEventListener('focus', () => { link.style.visibility = 'visible'; });
        link.addEventListener('blur', () => { link.style.visibility = 'hidden'; });
        if (document.body) {
            document.body.insertBefore(link, document.body.firstChild);
        }
    },

    fixFakeLinks() {
        if (typeof document === 'undefined') return;
        const links = document.querySelectorAll('a[href="#"], a[href="javascript:void(0)"], a:not([href])');
        links.forEach((link) => {
            if (!link.hasAttribute('role')) {
                link.setAttribute('role', 'button');
            }
            if (!link.hasAttribute('aria-label') && (!link.textContent || link.textContent.trim() === '')) {
                link.setAttribute('aria-label', 'Button');
            }
        });
    },

    setupLiveRegion() {
        if (typeof document === 'undefined') return;
        let liveRegion = document.getElementById('a11y-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'a11y-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.left = '-10000px';
            liveRegion.style.top = 'auto';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            if (document.body) {
                document.body.appendChild(liveRegion);
            }
        }
        this.liveRegion = liveRegion;
    },

    // Create a live region for screen reader announcements
    announce(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
        }
    }
};

// Integrated accessibility initialization inside newFunction
function newFunction() {
    try {
        if (typeof a11yStore !== 'undefined' && typeof a11yStore.init === 'function') {
            a11yStore.init();
        }
    } catch (e) {
        // Fail silently if DOM is unavailable
    }
    // ... your existing code ...
    return true;
}

// Export the new function
module.exports = {
    // ... existing exports ...
    newFunction,
    a11yStore: typeof a11yStore !== 'undefined' ? a11yStore : undefined
};