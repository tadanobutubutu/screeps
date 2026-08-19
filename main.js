// Fix for REACT_036: replace fake link with button
document.addEventListener('DOMContentLoaded', function() {
  const link = document.getElementById('unrotate');
  if (link && link.getAttribute('href') === '#') {
    const button = document.createElement('button');
    button.textContent = link.textContent;
    button.addEventListener('click', function() {
      // rotate back functionality
      if (window.rotateBack) {
        window.rotateBack();
      }
    });
    link.replaceWith(button);
  }
});