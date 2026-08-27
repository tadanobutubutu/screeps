// Example: Set the lang attribute on the root element dynamically
function setLanguage(lang) {
  document.documentElement.lang = lang;
}

// New function to add a <main> landmark to the primary content
function addMainLandmark() {
  const primaryContent = document.querySelector('div.container'); // Assuming the primary content is within a div with class 'container'
  if (primaryContent) {
    const mainElement = document.createElement('main');
    mainElement.appendChild(primaryContent);
    primaryContent.parentNode.insertBefore(mainElement, primaryContent);
  }
}

// Call the function to add the <main> landmark when the document is loaded
document.addEventListener('DOMContentLoaded', addMainLandmark);