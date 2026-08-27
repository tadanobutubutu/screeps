// ADD the following function to wrap the primary content in <main> element
function wrapPrimaryContentInMain() {
  // Assuming there is a root element ID for the primary content
  const primaryContent = document.getElementById('primary-content');

  if (primaryContent) {
    const mainElement = document.createElement('main');
    mainElement.appendChild(primaryContent);
    document.body.appendChild(mainElement);
  }
}

// CALL the function to wrap the primary content
wrapPrimaryContentInMain();