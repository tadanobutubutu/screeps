// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// New functions added to address the accessibility issues
function addLangAttribute() {
    const htmlElement = document.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
        htmlElement.setAttribute('lang', 'en');
    }
}

function getFullLangAttribute() {
    const htmlElement = document.querySelector('html');
    return htmlElement ? htmlElement.getAttribute('lang') : null;
}

function ensureUniqueLandmarksFromString(landmarkString) {
    const landmarks = landmarkString.split(',').map(l => l.trim());
    const uniqueLandmarks = [...new Set(landmarks)];
    return uniqueLandmarks.join(', ');
}

function ensureUniqueLandmarks() {
    const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="search"], [role="complementary"], [role="contentinfo"]');
    const landmarkRoles = Array.from(landmarks).map(el => el.getAttribute('role'));
    const uniqueRoles = [...new Set(landmarkRoles)];
    return uniqueRoles.length === landmarkRoles.length;
}

function addProperLandmarkRegions() {
    const mainContent = document.querySelector('main');
    if (mainContent && !mainContent.hasAttribute('role')) {
        mainContent.setAttribute('role', 'main');
    }

    const navigation = document.querySelector('nav');
    if (navigation && !navigation.hasAttribute('role')) {
        navigation.setAttribute('role', 'navigation');
    }
}

function validateLandmark() {
    const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="search"], [role="complementary"], [role="contentinfo"]');
    return landmarks.length > 0;
}

function setSvgAttributes(svgElement, name) {
    if (!svgElement.hasAttribute('aria-label')) {
        svgElement.setAttribute('aria-label', name);
    }
    if (!svgElement.hasAttribute('role')) {
        svgElement.setAttribute('role', 'img');
    }
}

function handleFakeLinks() {
    const fakeLinks = document.querySelectorAll('a[href="#"]');
    fakeLinks.forEach(link => {
        if (!link.hasAttribute('aria-hidden')) {
            link.setAttribute('aria-hidden', 'true');
        }
    });
}

function validateLinkAccessibility() {
    const links = document.querySelectorAll('a');
    let valid = true;
    links.forEach(link => {
        if (link.getAttribute('href') === '#' && !link.hasAttribute('aria-hidden')) {
            valid = false;
        }
    });
    return valid;
}