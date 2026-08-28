// Replace the fake link with a button element
const createRotateButton = () => {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.textContent = 'rotate back';
  button.type = 'button';
  return button;
};

// Example usage - append the button
const unrotateButton = createRotateButton();
document.body.appendChild(unrotateButton);

// Original functions preserved
module.exports = {
  createRotateButton,
};