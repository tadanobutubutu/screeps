// main.js

// Add the HTML lang attribute to the root element
document.documentElement.lang = 'en';

// New function to update the document title
function updateDocumentTitle(newTitle) {
  document.title = newTitle;
}

// New function to log a message to the console
function logMessage(message) {
  console.log(message);
}

// Fix 26 table structure issues
function updateTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Add or modify table elements as needed
    // For example, add a caption, ensure headers are present, etc.
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table caption';
      table.insertBefore(caption, table.firstChild);
    }
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
      if (!header.hasAttribute('scope')) {
        header.setAttribute('scope', 'col');
      }
    });
  });
}

// Add/fix 4 landmark issues
function fixLandmarkIssues() {
  let mainElements = document.querySelectorAll('main');
  const headers = document.querySelectorAll('header');
  const footers = document.querySelectorAll('footer');
  const navElements = document.querySelectorAll('nav');

  // If no main element exists, create one and wrap the primary content
  if (mainElements.length === 0) {
    const body = document.body;
    const main = document.createElement('main');

    // Move all body children into main (except script/style elements if needed)
    while (body.firstChild) {
      main.appendChild(body.firstChild);
    }

    body.appendChild(main);
  }

  // Re-query main elements after potentially creating one
  mainElements = document.querySelectorAll('main');

  // Ensure main elements have proper labeling
  mainElements.forEach((main, index) => {
    if (!main.id && !main.getAttribute('aria-label') && mainElements.length > 1) {
      main.setAttribute('aria-label', 'Main content section ' + (index + 1));
    }
  });

  // Re-query after potential replacements
  mainElements = document.querySelectorAll('main');

  // Fix duplicate main landmarks - convert additional main elements to section
  if (mainElements.length > 1) {
    mainElements.forEach((main, index) => {
      if (index > 0) {
        // Convert additional <main> elements to <section> elements
        const section = document.createElement('section');
        section.setAttribute('aria-label', 'Additional content section ' + index);

        // Move all children from main to section
        while (main.firstChild) {
          section.appendChild(main.firstChild);
        }

        // Copy any inline styles or classes
        if (main.className) section.className = main.className;
        if (main.id) section.id = main.id;

        // Replace main with section
        main.parentNode.replaceChild(section, main);
      }
    });
  }

  // Ensure navigation has labels if multiple nav elements exist
  let navIndex = 0;
  navElements.forEach(nav => {
    if (navElements.length > 1 && !nav.id && !nav.getAttribute('aria-label')) {
      navIndex++;
      nav.setAttribute('aria-label', 'Navigation ' + navIndex);
    }
  });

  // Add accessible names to 2 SVGs
  function addSVGAccessibleNames() {
    const svgs = document.querySelectorAll('svg');
    const svgNames = ['SVG description 1', 'SVG description 2'];
    let svgIndex = 0;

    svgs.forEach(svg => {
      if (svgIndex < svgNames.length && !svg.querySelector('title') && !svg.getAttribute('aria-labelledby')) {
        const title = document.createElement('title');
        title.id = 'svg-title-' + (svgIndex + 1);
        title.textContent = svgNames[svgIndex];
        svg.insertBefore(title, svg.firstChild);
        svg.setAttribute('aria-labelledby', title.id);
        svgIndex++;
      }
    });
  }

  // Ensure unique landmarks (2 issues)
  function ensureUniqueLandmarks() {
    const landmarks = document.querySelectorAll('[role="main"], main, header, footer, nav, aside');
    const landmarkNames = new Set();

    landmarks.forEach(landmark => {
      const name = landmark.getAttribute('aria-label') || landmark.id || '';
      if (landmarkNames.has(name) && name !== '') {
        // Handle duplicate landmark names by making them unique
        const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
        landmark.setAttribute('aria-label', name + ' ' + role);
      } else {
        landmarkNames.add(name);
      }
    });
  }

  // Fix 1 fake link issue
  function fixFakeLinkIssue() {
    const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');

    fakeLinks.forEach(link => {
      const text = link.textContent;
      const onClick = link.getAttribute('onclick') || '';

      // Convert to proper button if it's an action
      if (onClick || link.style.cursor === 'pointer') {
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
      }

      // Add keyboard support for Enter key
      if (onClick || link.getAttribute('role') === 'button') {
        link.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            link.click();
          }
        });
      }
    });
  }

  // Export required functions for testing
  export {
    updateDocumentTitle,
    logMessage,
    updateTableStructure,
    fixLandmarkIssues,
    addSVGAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinkIssue
  };
}