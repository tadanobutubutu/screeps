// main.js
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  
  // Draw something
  ctx.fillStyle = '#3498db';
  ctx.fillRect(10, 10, 100, 100);
  
  // Handle unrotate button click
  const unrotateBtn = document.getElementById('unrotate');
  if (unrotateBtn) {
    unrotateBtn.addEventListener('click', function() {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#3498db';
      ctx.fillRect(10, 10, 100, 100);
    });
  }
  
  // Rotate functionality
  document.getElementById('rotate')?.addEventListener('click', function() {
    ctx.translate(60, 60);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(-50, -50, 100, 100);
  });
});