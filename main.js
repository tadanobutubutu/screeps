// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - ADD_FOCUS: Make an HTML element focusable (NEW)

function makeFocusable(element) {
  if (element && element.hasAttribute && element.isInView && document.ghostedElements) {
    element.setAttribute('tabindex', 0);
    element.setAttribute('role', 'button');

    element.ontouchend = () => {
      element.focus();
      document.ghostedElements = document.ghostedElements.filter(el => el !== element);
    };
  }
}

function addLangAttribute(document, lang = 'en') {
  const html = document.documentElement;
  if (html && !html.hasAttribute('lang')) {
    html.setAttribute('lang', lang);
  }
  return html;
}

function removeFocusable(element) {
  if (element && element.hasAttribute) {
    element.removeAttribute('tabindex');
    element.removeAttribute('role');
  }
}

// Existing code and exports will go here...