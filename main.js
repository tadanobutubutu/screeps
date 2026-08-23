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

// Adding the new function to wrap the content in a main element if it's not already wrapped
function ensureMainLandmark() {
  const primaryContent = document.getElementById('primary-content');
  if (!primaryContent.querySelector('main')) {
    primaryContent.innerHTML = `<main>${primaryContent.innerHTML}</main>`;
  }
}

export { rotateBack, ensureMainLandmark };