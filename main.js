document.documentElement.lang = 'en';

function handleUnrotate() {
  document.body.style.transform = 'rotate(0deg)';
}

document.addEventListener('DOMContentLoaded', function() {
  const unrotateButton = document.getElementById('unrotate');
  if (unrotateButton) {
    unrotateButton.addEventListener('click', handleUnrotate);
  }
});