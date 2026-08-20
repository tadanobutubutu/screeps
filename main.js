function handleUnrotate() {
  // Your existing function implementation

  // Modify the anchor element to a button to make it clickable and accessible
  const unrotateButton = document.getElementById('unrotate');
  unrotateButton.outerHTML = `<button id="unrotate">rotate back</button>`;
}