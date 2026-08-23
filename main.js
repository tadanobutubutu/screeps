// This is a simple HTML file with a JavaScript function to handle the button click
// Based on the accessibility fix required for REACT_036

// Changed from <a id="unrotate" href="#">rotate back</a> to <button id="unrotate">rotate back</button>
// The <button> element is the correct semantic element for in-page actions

const unrotateElement = document.getElementById('unrotate');

// Check if the element is a button (after the fix) or an anchor (before the fix)
if (unrotateElement) {
  unrotateElement.addEventListener('click', function() {
    // Rotate back functionality
    const image = document.getElementById('target-image');
    if (image) {
      image.style.transform = 'rotate(0deg)';
    }
  });
}

// The HTML should contain:
// <button id="unrotate">rotate back</button>
// instead of:
// <a id="unrotate" href="#">rotate back</a>