console.log("Please provide the main.js file content");

document.addEventListener('DOMContentLoaded', function() {
  const link = document.getElementById('unrotate');
  if (link) {
    const button = document.createElement('button');
    button.textContent = 'rotate back';
    button.addEventListener('click', function() {
      // Add your rotation logic here or trigger existing functionality
      // Example: document.getElementById('rotation-container').classList.toggle('rotated');
    });
    link.parentNode.replaceChild(button, link);
  }
});