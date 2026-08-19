const UNROTATE_ID = 'unrotate';

// Add the unrotate function to handle table header rotation
function unrotate() {
  const headers = document.querySelectorAll('th[scope="col"]');
  headers.forEach(header => {
    const div = header.querySelector('div');
    if (div) {
      div.style.transform = 'rotate(-90deg)';
      div.style.transformOrigin = 'left center';
      div.style.whiteSpace = 'nowrap';
    }
  });
}

// Initialize the unrotate functionality when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  unrotate();
});