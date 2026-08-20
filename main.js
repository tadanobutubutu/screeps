// docs/dependency-graph.html:186
const rotateBack = () => {
  // Existing logic to rotate back
};

// Updated main.js content
const main = () => {
  // Other existing code

  // Replace the anchor with a button
  const unrotateButton = document.createElement('button');
  unrotateButton.id = 'unrotate';
  unrotateButton.addEventListener('click', rotateBack);
  document.body.appendChild(unrotateButton);

  // Continue with the rest of the code
};

// Call main function or export as needed
main();
// Or
export default main;