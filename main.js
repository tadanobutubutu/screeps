// ... (rest of the main.js code)

// Replace the problematic <a> tag with a <button>
// This is a placeholder function, replace with the actual logic if needed
function rotateBack() {
  console.log('Rotating back...');
  // Your rotation logic here
}

// Find the <a> element and replace it with a <button>
const unrotateLink = document.getElementById('unrotate');
if (unrotateLink) {
  unrotateLink.parentNode.replaceChild(
    document.createElement('button'), unrotateLink
  );
  unrotateLink.id = 'unrotate-button';
  unrotateLink.innerText = 'rotate back';
  unrotateLink.addEventListener('click', rotateBack);
}

// ... (rest of the main.js code)