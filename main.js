const primaryContent = document.querySelector('.primary-content') ||
                        document.querySelector('[role="main"]') ||
                        document.getElementById('main-content') ||
                        document.querySelector('#content');

function wrapPrimaryContentInMain() {
  if (primaryContent && !primaryContent.closest('main')) {
    const mainElement = document.createElement('main');

    primaryContent.parentNode.insertBefore(mainElement, primaryContent);
    mainElement.appendChild(primaryContent);

    return mainElement;
  }
  return null;
}

// Rest of the code remains the same

export { wrapPrimaryContentInMain };