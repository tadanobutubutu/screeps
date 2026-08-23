// Primary content wrapping and enhancement
const mainContent = `
  <main>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th scope="col">Column 1</th>
            <th scope="col">Column 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Data 1</td>
            <td>Data 2</td>
          </tr>
        </tbody>
      </table>
      <div class="actions">
        <button id="unrotate">rotate back</button>
      </div>
    </div>
  </main>
`;

// Preserve existing code, exports, and functions
const tableHeaders = document.querySelectorAll('table th');
tableHeaders.forEach(th => {
  th.setAttribute('scope', 'col');
});

function rotateBack() {
  const targets = document.querySelectorAll('.rotate-target');
  targets.forEach(el => {
    el.style.transform = 'rotate(0deg)';
  });
}

// Attach click event listener to the button
const unrotateButton = document.getElementById('unrotate');
if (unrotateButton) {
  unrotateButton.addEventListener('click', function () {
    rotateBack();
  });
}

export { rotateBack };