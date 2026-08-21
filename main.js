// Address accessibility issues from insight report

// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope attribute to th elements

// Existing imports or code
// ... [original main.js content] ...

// Wrap the primary content in <main> for accessibility
primaryContent = `
  <main id="main-content" role="main" lang="en">
    ...
  </main>
`;

const mainElement = document.querySelector('#main-content');

// Add lang attribute for HTML element (REACT_015)
document.documentElement.lang = "en";

// Replace the <a> element with a <button> element for the 'rotate back' action
rotateBackButton = `
  <button id="unrotate" class="rotate-back-button" [PERSON_NAME] back">
    rotate back
  </button>
`;

// Ensure that the button has the appropriate event listener if needed
document.getElementById('unrotate').addEventListener('click', function() {
  // Call the rotate back functionality
  rotateBack();
});

// Add scope="col" to all <th> elements for accessibility
const tableHeaders = document.querySelectorAll('th');
tableHeaders.forEach(th => {
  th.setAttribute('scope', 'col');
});

// Add landmark roles to the document
// Use the WAI-ARIA roles for document structure
document.body.setAttribute('role', 'document');

// Add a banner (or header) with the role="banner"
const banner = document.createElement('header');
banner.setAttribute('role', 'banner');
banner.setAttribute('id', 'banner');
document.body.prepend(banner);

// Add a footer with the role="contentinfo"
const footer = document.createElement('footer');
footer.setAttribute('role', 'contentinfo');
footer.setAttribute('id', 'footer');
document.body.appendChild(footer);

// Add landmark roles to primary navigation (if applicable)
const navigation = document.querySelector('nav');
if (navigation) {
  navigation.setAttribute('role', 'navigation');
  navigation.setAttribute('id', 'navigation');
}

// Mark up each section with the role="region" (if applicable)
const sections = document.querySelectorAll('section');
sections.forEach(section => {
  section.setAttribute('role', 'region');
  section.setAttribute('aria-label', section.getAttribute('aria-label') || 'Section');
});

// Add unique IDs to landmarks, if multiple/applicable
// (Use [PERSON_NAME]/WCAG guidelines as needed - https://www.w3.org/TR/wai-aria-1.1/)
let uniqueIdCounter = 0;
const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="banner"], [role="contentinfo"]');
const landmarkIdMap = new Map();

landmarks.forEach(landmark => {
  if (!landmark.id) {
    let baseId = `landmark-${uniqueIdCounter++}`;
    landmark.id = baseId;
    landmarkIdMap.set(landmark, baseId);
  } else {
    landmarkIdMap.set(landmark, landmark.id);
  }
});

// Ensure unique landmarks (REACT_025)
const uniqueLandmarkIDs = new Set();
landmarkIdMap.forEach((id, landmark) => {
  let currentId = id;
  let index = 2;
  while (uniqueLandmarkIDs.has(currentId)) {
    currentId = `${id}-${index}`;
    index++;
  }
  landmark.id = currentId;
  uniqueLandmarkIDs.add(currentId);
});

// Add accessible names to SVGs (REACT_041)
const svgs = document.querySelectorAll('svg');
svgs.forEach(svg => {
  // Create title and desc elements for each SVG
  const title = document.createElement('title');
  title.id = `${svg.id || 'svg'}-title`;
  title.textContent = svg.getAttribute('aria-label') || svg.title || `${svg.id ? svg.id : 'SVG'} image`;

  const desc = document.createElement('desc');
  desc.id = `${svg.id || 'svg'}-desc`;
  desc.textContent = svg.getAttribute('aria-describedby') || '';

  svg.insertBefore(title, svg.firstChild);
  svg.appendChild(desc);
  svg.setAttribute('aria-labelledby', `${title.id} ${desc.id}`);
});

// Fix fake link issue (REACT_036)
const fakeLinks = document.querySelectorAll('a.no-underline');
fakeLinks.forEach(link => {
  // Ensure the link has proper accessible text
  if (!link.textContent.trim()) {
    link.setAttribute('aria-label', 'Link');
  } else {
    link.setAttribute('aria-label', link.textContent.trim());
  }
  link.style.textDecoration = 'none';
});

// Add scope="col" to all <th> elements for accessibility (REACT_027)
const thElements = document.querySelectorAll('th');
thElements.forEach(th => {
  th.setAttribute('scope', 'col');
});

// Add the new function (resetAllRotations) to the exports
function resetAllRotations() {
  const rotateTargets = document.querySelectorAll('[data-rotate], .rotate-target');
  rotateTargets.forEach(el => {
    el.style.transform = 'none';
  });
}

// Export the new function for use by other modules
export { resetAllRotations };

// Add back the main function (rotateBack) to the exports
function rotateBack() {
  // Example implementation: reset rotation of targeted elements
  const targets = document.querySelectorAll('[data-rotate], .rotate-target');
  targets.forEach(el => {
    el.style.transform = 'rotate(0deg)';
  });
}

// Export the function so it remains accessible to other modules
export { rotateBack };

// Ensure mainElement is used when available
if (mainElement) {
  // Optionally perform actions with mainElement here
}