import { rotateBack } from './rotate.js';

const renderMainContent = () => {
  return `
    <main>
      <div class="content-area">
        <!-- main content -->
      </div>
    </main>
  `;
};

const renderControls = () => {
  return `
    <button id="unrotate" class="rotate-back-button" aria-label="Rotate back">
      rotate back
    </button>
  `;
};

document.addEventListener('DOMContentLoaded', () => {
  const unrotateBtn = document.getElementById('unrotate');
  if (unrotateBtn) {
    unrotateBtn.addEventListener('click', () => {
      rotateBack();
    });
  }
});

const tableHeaders = document.querySelectorAll('th');
tableHeaders.forEach(th => {
  th.setAttribute('scope', 'col');
});

function rotateBack() {
  const targets = document.querySelectorAll('.rotatable');
  targets.forEach(el => {
    el.style.transform = 'rotate(0deg)';
  });
}

export { rotateBack };