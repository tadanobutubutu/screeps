// Primary content wrapping and enhancement
const htmlContent = `
  ${isError ? `
    <div class="error-container">
      <p>Error occurred</p>
    </div>
  ` : `
    <div class="success-container">
      <p>Success content</p>
    </div>
  `}
`;

function renderContent() {
  return htmlContent;
}

// Replace the anchor element with a button and reattach click event listener
const unrotateButton = document.getElementById('unrotate');
if (unrotateButton) {
  unrotateButton.outerHTML = `
    <button id="unrotate" class="rotate-back-button" aria-label="Rotate back">
      rotate back
    </button>
  `;
  
  const newButton = document.getElementById('unrotate');
  if (newButton) {
    newButton.addEventListener('click', function () {
      rotateBack();
    });
  }
}

// Preserve existing code, exports, and functions
const tableHeaders = document.querySelectorAll('th');
tableHeaders.forEach(th => {
  th.setAttribute('scope', 'col');
});

function rotateBack() {
  const targets = document.querySelectorAll('.rotate-target');
  targets.forEach(el => {
    el.style.transform = 'rotate(0deg)';
  });
}

export { rotateBack };