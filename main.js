function addLandmarkRegions() {
  const container = document.getElementById('landmark-regions-container');
  if (container) {
    container.innerHTML = `
      <div class="landmark-region" role="region" aria-label="Building">
        Main Building
      </div>
      <div class="landmark-region" role="region" aria-label="Park">
        Central Park
      </div>
    `;
  }
}

// New function to ensure proper ARIA role for the container
function setARIAroleForContainer() {
  const container = document.getElementById('landmark-regions-container');
  if (container) {
    container.setAttribute('role', 'landmark');
  }
}

export { addLandmarkRegions, setARIAroleForContainer };