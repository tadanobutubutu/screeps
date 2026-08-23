function hasMultipleMainElements() {
  return document.querySelectorAll('main').length > 1;
}

function addAccessibleNameToSVGs() {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    if (!svg.querySelector('title') && !svg.querySelector('use') && !svg.getAttribute('aria-hidden')) {
      svg.setAttribute('aria-hidden', 'true');
    }
  });
}

function addMainLandmark() {
  const existingMain = document.querySelector('main');
  if (!existingMain) {
    const mainElement = document.createElement('main');
    mainElement.innerHTML = document.body.innerHTML;
    document.body.innerHTML = '';
    document.body.appendChild(mainElement);
  }
}

function wrapPrimaryContentInMain() {
  if (hasMultipleMainElements()) {
    console.warn('Multiple <main> elements detected. Only one <main> element should exist.');
    return;
  }
  addMainLandmark();
}

// Adding the lang attribute to the root HTML element
document.documentElement.lang = 'en';

// Call the function to wrap the primary content in a <main> landmark
wrapPrimaryContentInMain();