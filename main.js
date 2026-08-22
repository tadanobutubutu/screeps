// Main application logic
document.addEventListener('DOMContentLoaded', function() {
  const unrotateBtn = document.getElementById('unrotate');
  if (unrotateBtn) {
    unrotateBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // Reset rotation logic here
      document.body.style.transform = 'rotate(0deg)';
      document.body.style.transition = 'transform 0.3s ease';
    });
  }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { init: function() {} };
}