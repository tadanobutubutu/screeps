// main.js

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('image-container');
  const unrotateBtn = document.getElementById('unrotate');
  
  let currentRotation = 0;
  
  // Rotate image function
  function rotateImage(degrees) {
    currentRotation += degrees;
    container.style.transform = `rotate(${currentRotation}deg)`;
  }
  
  // Attach rotate functionality
  document.getElementById('rotate-left')?.addEventListener('click', () => {
    rotateImage(-90);
  });
  
  document.getElementById('rotate-right')?.addEventListener('click', () => {
    rotateImage(90);
  });
  
  // Fix: Changed from <a href="#"> to <button> for proper accessibility
  // Using <button> instead of fake link ensures correct keyboard and screen reader behavior
  unrotateBtn?.addEventListener('click', () => {
    currentRotation = 0;
    container.style.transform = 'rotate(0deg)';
  });
});

module.exports = { rotateImage };