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

export { rotateBack };