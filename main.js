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

function addLangAttribute() {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
}

export { addLandmarkRegions, addLangAttribute };