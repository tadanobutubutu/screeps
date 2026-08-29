function addLandmarkRegions() {
  const container = document.getElementById('landmark-regions-container');
  if (container) {
    // Existing content
    container.innerHTML = `
      <div class="landmark-region" role="region" aria-label="Building">
        Main Building
      </div>
      <div class="landmark-region" role="region" aria-label="Park">
        Central Park
      </div>
    `;

    // Accessibility checks for tables
    const table = document.createElement('table');
    table.setAttribute('role', 'table');
    table.setAttribute('aria-label', 'Landmark Regions');

    const row1 = table.insertRow();
    const cell1 = row1.insertCell(0);
    cell1.setAttribute('role', 'rowheader');
    cell1.setAttribute('aria-label', 'Building');
    cell1.textContent = 'Main Building';

    const row2 = table.insertRow();
    const cell2 = row2.insertCell(0);
    cell2.setAttribute('role', 'rowheader');
    cell2.setAttribute('aria-label', 'Park');
    cell2.textContent = 'Central Park';

    container.appendChild(table);
  }
}

export { addLandmarkRegions };