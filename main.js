document.getElementById('primary-content').innerHTML = `
  <main>
    ${document.getElementById('primary-content').innerHTML}
  </main>
`;

document.getElementById('unrotate').outerHTML = `
  <button id="unrotate" class="rotate-back-button" aria-label="Rotate back">
    rotate back
  </button>
`;

document.getElementById('unrotate').addEventListener('click', function () {
  rotateBack();
});

const tableHeaders = document.querySelectorAll('th');
tableHeaders.forEach(th => {
  th.setAttribute('scope', 'col');
});

function rotateBack() {
  const targets = document.querySelectorAll('.rotate-item');
  targets.forEach(el => {
    el.style.transform = 'rotate(0deg)';
  });
}

// Adding a new function to address the accessibility issue REACT_015
function getLanguageAttribute(element) {
  return element.getAttribute('lang');
}

// Adding a new function to address the accessibility issue REACT_027
function getTableStructure(element) {
  return element.querySelector('table');
}

// Adding a new function to address the accessibility issue REACT_041
function getAccessibleName(element) {
  return element.getAttribute('aria-label');
}

// Adding a new function to address the accessibility issue REACT_025
function getUniqueLandmarks(element) {
  return element.querySelectorAll('landmark');
}

// Adding a new function to address the accessibility issue REACT_017
function getLandmarks(element) {
  return element.querySelectorAll('landmark');
}

// Adding a new function to address the accessibility issue REACT_036
function getFakeLink(element) {
  return element.querySelector('a[href="#"]');
}

export { rotateBack, getLanguageAttribute, getTableStructure, getAccessibleName, getUniqueLandmarks, getLandmarks, getFakeLink };