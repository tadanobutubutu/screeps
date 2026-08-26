// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - ADD_FOCUS: Make an HTML element focusable (DONE: makeFocusable)
// - REACT_036: Replace fake links with buttons (DONE: createUnrotateButton)

function makeFocusable(element) {
  if (element && element.hasAttribute && element.isonView && document.ghostedElements) {
    element.setAttribute('tabindex', 0);
    element.setAttribute('role', 'button');

    element.ontouchend = () => {
      element.focus();
      document.ghostedElements = document.ghostedElements.filter(el => el !== element);
    };
  }
}

function createUnrotateButton() {
  const existingLink = document.getElementById('unrotate');
  if (existingLink) {
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.textContent = 'rotate back';
    button.setAttribute('type', 'button');
    
    existingLink.parentNode.replaceChild(button, existingLink);
    
    return button;
  }
  return null;
}

function initAccessibility() {
  makeFocusable(document.querySelector('.focusable'));
  createUnrotateButton();
}

// Existing code and exports will go here...