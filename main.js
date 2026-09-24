const main = require('./utilities');

const { createInPageButton, createWebResourceButton, validateLandmark, validateLandmarkStructure, validateAccessibilityReport, validateTableStructure, getSvgAccessibleName, getLangAttribute, addressAccessibilityIssues, focusTrap } = main;

const { addLangAttribute, fixTableStructureIssues, addMainLandmark, ensureUniqueLandmarks, setSvgAccessibilityProps, addSvgAccessibleNames, addAccessibleNamesToSVGs, fixFakeLinkIssue, fixFakeLinkIssues, fixLandmarkIssues, addLandmarkRegions, uniqueLandmarks, fixImageAltTexts, googleSignIn, handleCredentialResponse, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex } = main;

module.exports = {
  ...main,
  addressAccessibilityIssues: (container) => {
    const fixes = {
      langAdded: false,
      mainLandmarkAdded: false,
      landmarksFixed: 0,
      svgNamesAdded: 0,
      fakeLinksFixed: 0
    };

    const htmlElement = document.documentElement;
    const langAttr = getLangAttribute(htmlElement);
    if (!langAttr) {
      htmlElement.lang = 'en';
      fixes.langAdded = true;
    }

    const mainElement = document.querySelector('main');
    if (!mainElement) {
      const body = document.body;
      if (body) {
        const newMain = document.createElement('main');
        while (body.firstChild) {
          newMain.appendChild(body.firstChild);
        }
        body.insertBefore(newMain, body.firstChild);
        fixes.mainLandmarkAdded = true;
      }
    }

    const landmarkFixes = validateLandmark(container);
    if (landmarkFixes && landmarkFixes.length > 0) {
      fixes.landmarksFixed = landmarkFixes.length;
    }
    const landmarkStructureFixes = validateLandmarkStructure(container);
    if (landmarkStructureFixes && landmarkStructureFixes.length > 0) {
      fixes.landmarksFixed += landmarkStructureFixes.length;
    }

    const svgElements = container.querySelectorAll('svg');
    svgElements.forEach(svg => {
      const accessibleName = getSvgAccessibleName(svg);
      if (accessibleName && accessibleName.length > 0) {
        setSvgAccessibilityProps(svg, accessibleName);
        fixes.svgNamesAdded++;
      }
    });

    const fakeLinks = container.querySelectorAll('[style*="cursor: pointer"]');
    fakeLinks.forEach(link => {
      const style = window.getComputedStyle(link);
      if (style.cursor === 'pointer' || link.style.cursor === 'pointer') {
        link.setAttribute('role', 'link');
        link.setAttribute('tabindex', '0');
        fixes.fakeLinksFixed++;
      }
    });

    //Validate accessibility report
    const report = validateAccessibilityReport(container);
    if (report && report.length > 0) {
      log(`Accessibility report contains ${report.length} remaining issues`, 'warn');
    }

    if (fixes.langAdded) {
      log('Lang attribute added to HTML element', 'info');
    }

    if (fixes.mainLandmarkAdded) {
      log('Main landmark added', 'info');
    }

    const landmarkFixesCount = fixes.landmarksFixed || 0;
    if (landmarkFixesCount > 0) {
      log(`Fixed ${landmarkFixesCount} unique landmarks`, 'info');
    }

    const svgFixes = fixes.svgNamesAdded || 0;
    if (svgFixes > 0) {
      log(`Fixed accessible names for ${svgFixes} SVGs`, 'info');
    }

    const fakeLinkFixes = fixes.fakeLinksFixed || 0;
    if (fakeLinkFixes > 0) {
      log(`Fixed fake link issues for ${fakeLinkFixes} elements`, 'info');
    }

    return focusTrap(container);
  },

  // New focus trap functionality for keyboard navigation
  focusTrap: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    let activeElementIndex = focusableElements.length - 1;

    function setActiveElement(index) {
      if (index < 0) {
        index = focusableElements.length - 1;
      } else if (index >= focusableElements.length) {
        index = 0;
      }

      if (focusableElements[index]) {
        focusableElements[index].focus();
      } else {
        focusableElements[0].focus();
      }
      activeElementIndex = index;
    }

    function nextFocusableElement() {
      setActiveElement(activeElementIndex + 1);
    }

    function previousFocusableElement() {
      setActiveElement(activeElementIndex - 1);
    }

    function moveFocusToFirst() {
      setActiveElement(0);
    }

    function moveFocusToLast() {
      setActiveElement(focusableElements.length - 1);
    }

    element.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Tab':
          if (e.shiftKey) {
            previousFocusableElement();
          } else {
            nextFocusableElement();
          }
          e.preventDefault();
          break;
        case 'ArrowLeft':
          previousFocusableElement();
          e.preventDefault();
          break;
        case 'ArrowRight':
          nextFocusableElement();
          e.preventDefault();
          break;
        case 'Home':
          moveFocusToFirst();
          e.preventDefault();
          break;
        case 'End':
          moveFocusToLast();
          e.preventDefault();
          break;
      }
    });
  },

  // ... rest of the functions omitted for brevity
};