// main.js

// Handle unrotate button click
const unrotateBtn = document.getElementById('unrotate');
if (unrotateBtn) {
  unrotateBtn.addEventListener('click', () => {
    // Logic to rotate back
    document.body.classList.remove('rotated');
  });
}

export function initializeApp() {
  // ... existing code
}

export function rotateBack() {
  document.body.classList.remove('rotated');
}