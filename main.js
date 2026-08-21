// Address accessibility issues from insight report

// Existing imports or code
// ... [original main.js content] ...

// Wrap the primary content in <main> for accessibility
primaryContent = `
  <main id="main-content" role="main" lang="en">
    ...
  </main>
`;

// Replace the <a> element with a <button> element for the 'rotate back' action
rotateBackButton = `
  <button id="unrotate" class="rotate-back-button" aria-label="Rotate back">
    rotate back
  </button>
`;

// Ensure that the button has the appropriate event listener if needed
document.getElementById('unrotate').addEventListener('click', function() {
  // Call the rotate back functionality
  rotateBack();
});

// Add lang attribute for HTML element
document.documentElement.lang = "en";

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
document.body.prepend(banner);

// Add a footer with the role="contentinfo"
const footer = document.createElement('footer');
footer.setAttribute('role', 'contentinfo');
document.body.appendChild(footer);

// Add landmark roles to primary navigation (if applicable)
const navigation = document.querySelector('nav');
if (navigation) {
  navigation.setAttribute('role', 'navigation');
}

// Mark up each section with the role="region" (if applicable)
const sections = document.querySelectorAll('section');
sections.forEach(section => {
  section.setAttribute('role', 'region');
});

// Add unique IDs to landmarks, if multiple/applicable
// (Use WAI-ARIA/WCAG guidelines as needed - https://www.w3.org/TR/wai-aria-1.1/)
let uniqueIdCounter = 0;
const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="header"], [role="footer"]');
landmarks.forEach(landmark => {
  if (!landmark.id) {
    landmark.id = `landmark-${uniqueIdCounter++}`;
  }
});

// Add accessible names to 2 SVGs
const svgs = document.querySelectorAll('svg');
svgs.forEach(svg => {
  // Create title and desc elements for each SVG
  const title = document.createElement('title');
  title.id = `${svg.id}-title`;
  title.textContent = svg.id ? `${svg.id} image` : 'SVG image';
  
  const desc = document.createElement('desc');
  desc.id = `${svg.id}-desc`;
  desc.textContent = ''; // Add a proper description in the SVG file if necessary
  
  svg.insertBefore(title, svg.firstChild);
  svg.appendChild(desc);
  svg.setAttribute('aria-labelledby', `${title.id} ${desc.id}`);
});

// Ensure unique landmarks
const uniqueLandmarkIDs = new Set();
landmarks.forEach(landmark => {
  if (landmark.id) {
    let index = 2;
    let currentId = landmark.id;
    while (uniqueLandmarkIDs.has(currentId)) {
      currentId = `${landmark.id}-${index}`;
      index++;
    }
    landmark.id = currentId;
    uniqueLandmarkIDs.add(currentId);
  }
});

// Fix 1 fake link issue
// (More checks might be needed based on the specific CSS and HTML structure)
const fakeLinks = document.querySelectorAll('a.no-underline');
fakeLinks.forEach(link => {
  // Ensure the link has proper accessible text
  if (!link.textContent.trim()) {
    link.setAttribute('aria-label', 'Link');
  }
  link.style.textDecoration = 'none';
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