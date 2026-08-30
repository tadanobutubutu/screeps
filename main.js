// Existing imports, constants, and functions

// TODO: Create or update the affected functions to be accessible
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())

function getLangAttribute() {
  const htmlElement = document.documentElement;
  let lang = htmlElement.getAttribute('lang');

  if (!lang) {
    lang = htmlElement.getAttribute('xml:lang');
  }

  if (!lang) {
    lang = 'en';
    htmlElement.setAttribute('lang', lang);
  }

  return lang;
}

function createInPageButton(options) {
  const {
    id,
    text,
    className = 'in-page-button',
    onClick,
    ariaLabel,
    lang
  } = options || {};

  if (!id || !text) {
    throw new Error('createInPageButton: "id" and "text" are required options.');
  }

  const button = document.createElement('button');
  button.id = id;
  button.type = 'button';
  button.className = className;
  button.textContent = text;

  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  } else {
    button.setAttribute('aria-label', text);
  }

  if (lang) {
    button.setAttribute('lang', lang);
  }

  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }

  return button;
}

module.exports = {
  // Existing exports
  getLangAttribute,
  createInPageButton,
};