// ... (Preserve existing code and imports)

// Original content from `docs/dependency-graph.html:186`
const rotateBackLink = document.getElementById('unrotate');

// Replace the anchor tag with a button tag
const rotateBackButton = document.createElement('button');
rotateBackButton.id = 'unrotate';
rotateBackButton.textContent = 'rotate back';
rotateBackButton.onclick = () => {
  // ... (Preserve the existing onclick functionality if any)
};

// Replace the anchor element with the new button element
rotateBackLink.parentNode.replaceChild(rotateBackButton, rotateBackLink);

// ... (Preserve existing code and exports)