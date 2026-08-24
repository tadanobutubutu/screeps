// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

// Assuming you have a button with ID 'myButton'
const button = document.getElementById('myButton');
button.setAttribute('aria-label', 'My Button');
button.setAttribute('role', 'button');
button.setAttribute('aria-expanded', 'false');

// New function to handle button click
function handleButtonClick() {
  const button = document.getElementById('myButton');
  const isExpanded = button.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
  button.setAttribute('aria-expanded', isExpanded);
}

// New function to ensure HTML lang attribute is set
function addLangAttribute() {
  const html = document.documentElement;
  html.setAttribute('lang', 'en');
}

// New function to inject and fix fake links
function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('.fake-link');
  fakeLinks.forEach(fakeLink => {
    if (fakeLink.tagName === 'DIV' || fakeLink.tagName === 'SPAN') {
      const a = document.createElement('a');
      a.href = fakeLink.getAttribute('data-href') || '#';
      a.textContent = fakeLink.textContent;
      fakeLink.replaceWith(a);
    }
  });
}

// Ensure Unique Landmarks Function
function ensureUniqueLandmarks() {
  const existingHeaders = document.querySelectorAll('header');
  const existingFooters = document.querySelectorAll('footer');

  if (existingHeaders.length > 1) {
    existingHeaders.forEach((header, index) => index > 0 && header.remove());
  }
  if (existingFooters.length > 1) {
    existingFooters.forEach((footer, index) => index > 0 && footer.remove());
  }
}

// New function to inject primary content into main landmark
function wrapPrimaryContentInMain() {
  const existingMains = document.querySelectorAll('main');

  // Remove duplicate main elements if any
  existingMains.forEach((main, index) => {
    if (index > 0) {
      main.remove();
    }
  });

  // If no main element exists, create and wrap primary content
  const mainElement = document.createElement('main');
  mainElement.setAttribute('role', 'main');

  // Find primary content container (adjust selector based on your content structure)
  const contentContainer = document.querySelector('.main-content') || document.querySelector('.content') || document.body;

  // Move existing content into main if not already inside one
  if (!contentContainer.querySelector('main')) {
    while (contentContainer.firstChild) {
      mainElement.appendChild(contentContainer.firstChild);
    }
    contentContainer.appendChild(mainElement);
  }
}

// New function to add 'scope="col"' attribute to table header cells
function addScopeToTableHeaders() {
  const headers = document.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
}

// React component for Dependency Graph
const DependencyGraph = () => {
  return (
    <div>
      {/* ... other content ... */}
      <table>
        <thead>
          <tr>
            {/* ... other header cells ... */}
            <th scope="col"><div>src/constants.js</div></th>
            <th scope="col"><div>src/managers/roomManager.js</div></th>
            <th scope="col"><div>src/managers/spawnManager.js</div></th>
            <th scope="col"><div>src/managers/towerManager.js</div></th>
            <th scope="col"><div>src/roles/builder.js</div></th>
            {/* ... other header cells ... */}
          </tr>
        </thead>
        <tbody>
          {/* ... other table rows ... */}
        </tbody>
      </table>
      {/* ... other content ... */}
    </div>
  );
};

export default DependencyGraph;

// Call all necessary functions
addLangAttribute();
fixFakeLinks();
ensureUniqueLandmarks();
wrapPrimaryContentInMain();
addScopeToTableHeaders();

module.exports = {
  wrapPrimaryContentInMain,
  handleButtonClick,
  addLangAttribute,
  fixFakeLinks,
  ensureUniqueLandmarks,
  DependencyGraph, // Added DependencyGraph as an accessible React component
  addScopeToTableHeaders,
};