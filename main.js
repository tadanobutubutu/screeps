// main.js
// Fixed REACT_036: Changed <a href="#"> to <button> for accessibility

const initApp = () => {
  const unrotateBtn = document.getElementById('unrotate');
  
  if (unrotateBtn) {
    // Use event delegation or direct binding
    unrotateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Reset the rotation transform on the target element
      const rotatedElement = document.querySelector('.rotated-content');
      if (rotatedElement) {
        rotatedElement.style.transform = 'rotate(0deg)';
      }
    });
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initApp };
}