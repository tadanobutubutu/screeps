// main.js

// Sample application code
document.addEventListener('DOMContentLoaded', function() {
  // ... existing code ...

  // The problematic line was:
  // <a id="unrotate" href="#">rotate back</a>
  
  // Fixed: Changed from anchor with href="#" to button for in-page actions
  // This ensures proper keyboard navigation and screen reader behavior
  
  const unrotateBtn = document.createElement('button');
  unrotateBtn.id = 'unrotate';
  unrotateBtn.type = 'button';
  unrotateBtn.textContent = 'rotate back';
  unrotateBtn.setAttribute('aria-label', 'Rotate back to original position');
  
  // Replace the old anchor element if it exists
  const oldElement = document.getElementById('unrotate');
  if (oldElement && oldElement.tagName === 'A') {
    oldElement.parentNode.replaceChild(unrotateBtn, oldElement);
  }
  
  // Add the click handler
  unrotateBtn.addEventListener('click', function() {
    // rotation logic here
    console.log('Rotate back clicked');
  });
  
  // ... rest of existing code ...
});