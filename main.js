// Primary content wrapping and enhancement
document.getElementById('primary-content').innerHTML = `
  <main>
    ${document.getElementById('primary-content').innerHTML}
  </main>
`;

// Replace the anchor element with a button and reattach click event listener
const unrotateButton = document.getElementById('unrotate');
unrotateButton.outerHTML = `
  <button id="unrotate" class="rotate-back-button" aria-label="Rotate back">
    rotate back
  </button>
`;
unrotateButton.addEventListener('click', function () {
  rotateBack();
});

// Preserve existing code, exports, and functions
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