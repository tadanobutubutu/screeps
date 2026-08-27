// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

// Add lang attribute to HTML element
const htmlElement = document.documentElement;
htmlElement.setAttribute('lang', 'en');

// Function to add landmark roles and fix landmark issues
function addLandmarkRoles() {
  // Find the main app content and wrap it in a div with role "main"
  const mainContent = document.querySelector('#application');
  const mainDiv = document.createElement('div');
  mainDiv.setAttribute('role', 'main');
  mainContent.parentNode.insertBefore(mainDiv, mainContent);
  mainDiv.appendChild(mainContent);

  // Find the header and give it a role of "banner"
  const header = document.querySelector('header');
  header.setAttribute('role', 'banner');

  // Find the main navigation and give it a role of "navigation"
  const nav = document.querySelector('nav');
  nav.setAttribute('role', 'navigation');

  // ... Continue this function to add other landmarks as needed
}
addLandmarkRoles();

// Function to add accessible names to 2 SVGs
function addSVGAccessibleNames() {
  const svg1 = document.querySelector('#svg1');
  svg1.setAttribute('aria-labelledby', 'svg1-title svg1-desc');
  const svg1Title = document.createElement('span');
  svg1Title.id = 'svg1-title';
  svg1Title.textContent = 'Title for SVG1';
  const svg1Desc = document.createElement('span');
  svg1Desc.id = 'svg1-desc';
  svg1Desc.textContent = 'Description for SVG1';
  svg1.appendChild(svg1Title);
  svg1.appendChild(svg1Desc);

  // ... Continue this function to add accessible names to SVG2 as needed
}
addSVGAccessibleNames();

// Function to fix 1 fake link issue
function fixFakeLink() {
  const fakeLink = document.querySelector('#fake-link');
  if (fakeLink) {
    fakeLink.addEventListener('click', (event) => {
      alert('This is a fake link. Canceling navigation.');
      event.preventDefault();
    });
  }
}
fixFakeLink();

// Function to check for unique landmarks
function checkForUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role]');
  const landmarkNames = Array.from(landmarks).map((landmark) => landmark.getAttribute('role'));
  const uniqueLandmarks = new Set(landmarkNames);

  if (landmarkNames.length !== uniqueLandmarks.size) {
    console.error('Not all landmarks are unique:', Array.from(landmarkNames));
    console.error('Unique landmarks:', Array.from(uniqueLandmarks));
  }
}
checkForUniqueLandmarks();