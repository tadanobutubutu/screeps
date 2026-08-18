// main.js

// Sample function to handle the unrotate action
function unrotate() {
  // Logic to rotate back
  console.log('Rotating back...');
}

// Attach event listener when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const unrotateBtn = document.getElementById('unrotate');
  if (unrotateBtn) {
    unrotateBtn.addEventListener('click', unrotate);
  }
});

// Export for module usage if needed
module.exports = { unrotate };