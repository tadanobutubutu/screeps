// Fixed: Changed <a href="#"> to <button> for accessibility
// Before: <a id="unrotate" href="#">rotate back</a>
// After: <button id="unrotate" type="button">rotate back</button>

// Example main.js content
const init = () => {
  const unrotateBtn = document.getElementById('unrotate');
  if (unrotateBtn) {
    unrotateBtn.addEventListener('click', () => {
      // Rotate back logic
      console.log('Rotating back...');
    });
  }
};

document.addEventListener('DOMContentLoaded', init);

module.exports = { init };