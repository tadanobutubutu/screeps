// Main application logic
document.addEventListener('DOMContentLoaded', () => {
  const imageContainer = document.getElementById('image-container');
  const image = document.getElementById('target-image');
  
  // Rotate functionality
  let rotation = 0;
  
  function rotateImage(degrees) {
    rotation += degrees;
    image.style.transform = `rotate(${rotation}deg)`;
  }
  
  // Fix: Use a button instead of an anchor tag for in-page actions
  const unrotateButton = document.createElement('button');
  unrotateButton.id = 'unrotate';
  unrotateButton.type = 'button';
  unrotateButton.textContent = 'rotate back';
  unrotateButton.addEventListener('click', () => {
    rotation = 0;
    image.style.transform = 'rotate(0deg)';
  });
  
  imageContainer.appendChild(unrotateButton);
  
  // Original rotation button
  const rotateButton = document.createElement('button');
  rotateButton.type = 'button';
  rotateButton.textContent = 'Rotate 90°';
  rotateButton.addEventListener('click', () => rotateImage(90));
  
  imageContainer.insertBefore(rotateButton, unrotateButton);
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { rotateImage: () => {} };
}