function rotateContent(direction) {
  const content = document.querySelector('.rotatable-content');
  if (content) {
    const rotation = direction === 'back' ? 0 : 90;
    content.style.transform = `rotate(${rotation}deg)`;
  }
}

function setupEventListeners() {
  const unrotateButton = document.getElementById('unrotate');
  if (unrotateButton) {
    unrotateButton.addEventListener('click', () => {
      rotateContent('back');
    });
  }
  
  const rotateButton = document.getElementById('rotate');
  if (rotateButton) {
    rotateButton.addEventListener('click', () => {
      rotateContent('forward');
    });
  }
}

document.addEventListener('DOMContentLoaded', setupEventListeners);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { rotateContent, setupEventListeners };
}