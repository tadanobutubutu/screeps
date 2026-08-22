// main.js - Fixed version with accessibility improvements

export function createRotateControls(container) {
  const rotateButton = document.createElement('button');
  rotateButton.id = 'rotate';
  rotateButton.textContent = 'rotate';
  rotateButton.className = 'rotate-btn';
  container.appendChild(rotateButton);

  // Fixed: Changed from <a href="#"> to <button> for proper accessibility
  const unrotateButton = document.createElement('button');
  unrotateButton.id = 'unrotate';
  unrotateButton.textContent = 'rotate back';
  unrotateButton.className = 'rotate-btn';
  container.appendChild(unrotateButton);

  return { rotateButton, unrotateButton };
}

export function initializeApp() {
  const container = document.getElementById('controls');
  if (container) {
    const controls = createRotateControls(container);
    
    controls.rotateButton.addEventListener('click', () => {
      document.body.classList.add('rotated');
    });
    
    controls.unrotateButton.addEventListener('click', () => {
      document.body.classList.remove('rotated');
    });
  }
}

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initializeApp);
}

export { createRotateControls as default };