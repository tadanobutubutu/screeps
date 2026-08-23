// Table rotation functionality with accessibility improvements

const tableHeaders = document.querySelectorAll('th');
tableHeaders.forEach(th => {
  th.setAttribute('scope', 'col');
});

function rotateTable(table) {
  if (!table) return;
  const cells = table.querySelectorAll('td, th');
  cells.forEach(cell => {
    cell.style.transform = 'rotate(180deg)';
  });
}

function rotateBack() {
  const targets = document.querySelectorAll('#table-container td, #table-container th');
  targets.forEach(el => {
    el.style.transform = 'rotate(0deg)';
  });
}

// Initialize rotate back button
const unrotateButton = document.getElementById('unrotate');
if (unrotateButton) {
  unrotateButton.addEventListener('click', function(e) {
    e.preventDefault();
    rotateBack();
  });
}

// Primary content wrapping and enhancement
const content = document.getElementById('content');
if (content) {
  content.innerHTML = `
    <main>
      <div id="table-container">
        ${content.innerHTML}
      </div>
    </main>
  `;
}

// Replace the anchor element with a button and reattach click event listener
const anchorElement = document.querySelector('a#unrotate[href="#"]');
if (anchorElement) {
  anchorElement.outerHTML = `
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

export { rotateBack, rotateTable };