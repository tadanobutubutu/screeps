function hasMultipleMainElements() {
  return document.querySelectorAll('main').length > 1;
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

// Ensure that the primary content is wrapped in a <main> landmark
function wrapPrimaryContentInMain() {
  if (hasMultipleMainElements()) {
    console.warn('Multiple <main> elements detected. Only one <main> element should exist.');
    return;
  }

  addMainLandmark();
}

// Call the function to wrap the primary content in a <main> landmark
wrapPrimaryContentInMain();