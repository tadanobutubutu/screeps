// main.js
function updateUI() {
  const rotateBackLink = document.createElement('a');
  rotateBackLink.id = 'unrotate';
  rotateBackLink.href = '#';
  rotateBackLink.textContent = 'rotate back';
  
  // Assuming some logic to append this link to the DOM
  document.body.appendChild(rotateBackLink);
}

// Existing code to call updateUI
updateUI();