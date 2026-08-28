const createRotateButton = (() => {
  const getInAccessibleButton = () => {
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.textContent = 'rotate back';
    button.type = 'button';
    button.style.display = 'none';
    return button;
  };

  const updateButtonAccessibility = () => {
    const button = document.getElementById('unrotate');
    if (button) {
      button.removeAttribute('style');
      button.setAttribute('aria-label', 'Rotate button');
    }
  };

  let unrotateButton = null;

  return () => {
    if (!unrotateButton) {
      unrotateButton = getInAccessibleButton();
      document.body.appendChild(unrotateButton);
    }
    updateButtonAccessibility();
    return unrotateButton;
  };
})();

module.exports = {
  createRotateButton,
  // ... the existing functions and properties
};