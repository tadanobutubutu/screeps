// main.js

// Existing code preserved
const img = document.getElementById('target');
let rotation = 0;

// Import dependency graph and index content modules
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

// Fix REACT_015: Add proper lang attribute to HTML element
export function createHtmlElement(language = 'en') {
  // Existing function with the addition of the critical lang attribute
  return {
    type: 'html',
    props: {
      lang: language, // Critical: HTML lang attribute required
      children: []
    }
  };
}

function rotate() {
    rotation += 90;
    img.style.transform = `rotate(${rotation}deg)`;
}

function rotateBack() {
    rotation = 0;
    img.style.transform = `rotate(0deg)`;
}

// New code to be added:
function toggleRotation() {
    rotation += rotation === 360 ? -360 : 90;
    img.style.transform = `rotate(${rotation}deg)`;
}

// Function for adding proper landmark regions
export function addLandmarks(content) {
  let headerId = 'landmark-header';
  let navId = 'landmark-nav';
  let mainId = 'landmark-main';
  let footerId = 'landmark-footer';
  let landmarkComponents = [null, null, null, null];

  if (content) {
    const header = content.querySelector('header');
    if (header) {
      headerId = header.id || header.getAttribute('id') || header.getAttribute('data-testid') || headerId;
      landmarkComponents[0] = {
        type: 'header',
        props: {
          id: headerId,
          role: 'banner',
          'aria-label': 'Site header',
          className: 'landmark-header',
          children: [header]
        }
      };
    }

    const navs = [...content.querySelectorAll('nav')];
    navs.forEach((nav, index) => {
      if (!landmarkComponents[1]) {
        navId = nav.id || nav.getAttribute('id') || nav.getAttribute('data-testid') || navId;
        landmarkComponents[1] = {
          type: 'nav',
          props: {
            id: navId,
            role: 'navigation',
            'aria-label': 'Main navigation',
            className: 'landmark-nav',
            children: [nav]
          }
        };
      } else {
        nav.id = navId;
      }
    });

    const main = content.querySelector('main');
    if (main) {
      mainId = main.id || main.getAttribute('id') || main.getAttribute('data-testid') || mainId;
      landmarkComponents[2] = {
        type: 'main',
        props: {
          id: mainId,
          role: 'main',
          'aria-label': 'Main content',
          className: 'landmark-main',
          children: [main]
        }
      };
    }

    const footer = content.querySelector('footer');
    if (footer) {
      footerId = footer.id || footer.getAttribute('id') || footer.getAttribute('data-testid') || footerId;
      landmarkComponents[3] = {
        type: 'footer',
        props: {
          id: footerId,
          role: 'contentinfo',
          'aria-label': 'Site footer',
          className: 'landmark-footer',
          children: [footer]
        }
      };
    }
  }

  return landmarkComponents;
}

// ... (The remaining code from original main.js)

// Attach event listeners
document.getElementById('rotate').addEventListener('click', rotate);
document.getElementById('unrotate').addEventListener('click', rotateBack);
// New event listener for the toggle rotation functionality
document.getElementById('toggle-rotate').addEventListener('click', toggleRotation);

// Export the new function if needed, otherwise preserve existing exports
export { rotate, rotateBack, toggleRotation, ensureUniqueLandmarks, addLandmarks, enhanceFocusVisibility, addressAccessibilityIssues, createHtmlElement };