const requiredFunction = null; // Placeholder for any required functions from other files

// Function for adding proper landmark regions
function addLandmarkRegions(container, regions = []) {
  const defaultRegions = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  const landmarkRoles = {
    banner: 'banner',
    navigation: 'navigation',
    main: 'main',
    complementary: 'complementary',
    contentinfo: 'contentinfo'
  };
  const regionConfig = regions.length > 0 ? regions : defaultRegions;

  if (typeof container === 'string') {
    container = document.querySelector(container);
  }
  if (!container) {
    return null;
  }

  const addedRegions = {};
  regionConfig.forEach(regionType => {
    if (landmarkRoles[regionType]) {
      const element = document.createElement('div');
      element.setAttribute('role', landmarkRoles[regionType]);
      element.className = `landmark-region landmark-${regionType}`;
      addedRegions[regionType] = element;
      if (regionType === 'main') {
        element.setAttribute('aria-labelledby', 'main-label'); // Add an aria-labelledby attribute to ID the main landmark
      }
    }
  });

  if (container.getElementById('main-label')) {
    // Reuse existing 'main' label if available
    addedRegions.main.setAttribute('aria-labelledby', 'main-label');
  } else {
    // Create a label for the 'main' landmark if one doesn't already exist
    const mainLabel = document.createElement('h1');
    mainLabel.id = 'main-label';
    mainLabel.innerHTML = 'Main Content';
    container.insertBefore(mainLabel, container.firstChild);
  }

  return addedRegions;
}

// Function for adding missing <main> landmark to the specified HTML elements
function addMainLandmark(htmlElements) {
  htmlElements.forEach(element => {
    const mainElement = element.getElementsByTagName('main')[0];
    if (!mainElement) {
      const main = document.createElement('main');
      main.setAttribute('role', 'main'); // Add 'role' attribute to the main element
      main.className = 'landmark-main';
      element.appendChild(main);
    }
  });
}

// Function to identify and correct fake links
function correctFakeLinks(container) {
  const links = container.getElementsByTagName('a');
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    if (
      link.getAttribute('href') === '#' ||
      link.getAttribute('href') === null ||
      link.getAttribute('href') === '' ||
      (!link.hasAttribute('href') && link.innerText === '')
    ) {
      link.removeAttribute('href'); // Remove href attribute for fake links
      link.setAttribute('aria-hidden', 'true'); // Hide fake links using aria-hidden attribute
    }
  }
}

// New function to check and correct for duplicate <main> elements
function checkAndCorrectDuplicateMainElements(container) {
  const mainElements = container.querySelectorAll('main');
  if (mainElements.length > 1) {
    console.warn('Duplicate <main> elements found. Correcting...');
    // Remove all but the first <main> element
    for (let i = 1; i < mainElements.length; i++) {
      mainElements[i].parentNode.removeChild(mainElements[i]);
    }
  }
}

module.exports = {
  requiredFunction: requiredFunction,
  addLandmarkRegions: addLandmarkRegions,
  addMainLandmark: addMainLandmark,
  correctFakeLinks: correctFakeLinks,
  checkAndCorrectDuplicateMainElements: checkAndCorrectDuplicateMainElements
};