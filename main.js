import { assignLandmarkRoles } from './accessibilityUtils';

// Add lang attribute to HTML element
function addLangAttribute(elem, lang) {
  if (elem instanceof Element && !elem.hasAttribute('lang')) {
    elem.setAttribute('lang', lang);
  }
}

// Named export for `addLangAttribute` function
export { addLangAttribute };

// Add accessible names to 2 SVGs
const svgs = document.getElementsByTagName('svg');
for (let i = 0; i < svgs.length; i++) {
  const svg = svgs[i];
  if (svg.hasAttribute('aria-labelledby')) continue;

  const title = svg.getAttribute('title');
  if (title) svg.setAttribute('aria-labelledby', title);

  const desc = svg.querySelector('desc');
  if (desc) svg.setAttribute('aria-labelledby', desc.getAttribute('text'));
}

// Assign landmark roles and fix landmark issues
assignLandmarkRoles();

// Ensure unique landmarks (2 issues)
function hasLandmarkRole(elem) {
  const landmarkRoles = ['banner', 'navigation', 'main', 'footer', 'form', 'table'];
  return landmarkRoles.includes(elem.nodeName.toLowerCase());
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role], [aria-labelledby]');

  const countedLandmarks = {};
  for (let i = 0; i < landmarks.length; i++) {
    const landmark = landmarks[i];
    const role = landmark.getAttribute('role');
    if (role && countedLandmarks[role]) {
      console.warn(`Asterisk: Entity ${role} appears in the document more than once.`);
    }

    const id = landmark.getAttribute('aria-labelledby');
    if (id && countedLandmarks[id]) {
      console.warn(`Asterisk: Labeled landmark with ID "${id}" appears in the document more than once.`);
    }

    countedLandmarks[role || id] = true;
  }
}

// Fix 1 fake link issue
function fixFakeLink(\_this, node, userData) {
  // Your existing fixFakeLink function implementation goes here
}

// Add scope="col" or scope="row" to <th> elements (already implemented)
// ... existing implementation for REACT_027 ...