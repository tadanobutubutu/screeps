document.addEventListener('DOMContentLoaded', function() {
  var unrotateBtn = document.getElementById('unrotate');
  var rotatingElement = document.getElementById('rotating-element');

  if (unrotateBtn && rotatingElement) {
    unrotateBtn.addEventListener('click', function() {
      rotatingElement.style.transform = 'rotate(0deg)';
      rotatingElement.classList.remove('rotated');
    });
  }
});