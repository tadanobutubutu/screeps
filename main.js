// main.js

function wrapPrimaryContentInMain() {
  const primaryContent = document.getElementById('primary-content') || 
                         document.querySelector('.primary-content');
  
  if (!primaryContent) {
    return;
  }
  
  const mainElement = document.createElement('main');
  
  while (primaryContent.firstChild) {
    mainElement.appendChild(primaryContent.firstChild);
  }
  
  primaryContent.appendChild(mainElement);
}

document.addEventListener('DOMContentLoaded', () => {
  wrapPrimaryContentInMain();
});

module.exports = { wrapPrimaryContentInMain };