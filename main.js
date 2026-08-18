// main.js
// ... existing code ...

// Find and replace the fake link with a proper button
// Old: <a id="unrotate" href="#">rotate back</a>
// New:
const unrotateButton = document.createElement('button');
unrotateButton.id = 'unrotate';
unrotateButton.type = 'button';
unrotateButton.textContent = 'rotate back';
unrotateButton.className = 'unrotate-class'; // preserve existing class if any
unrotateButton.addEventListener('click', handleRotateBack);

// Replace in DOM
const oldLink = document.getElementById('unrotate');
if (oldLink) {
  oldLink.parentNode.replaceChild(unrotateButton, oldLink);
}

// ... rest of existing code ...