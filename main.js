// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - ADD_FOCUS: Make an HTML element focusable (NEW)

function addLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

function makeFocusable() {
  const focusableSelector = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
  const focusableElements = document.querySelectorAll(focusableSelector);
  focusableElements.forEach((el) => {
    if (!el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
    }
  });
}

module.exports = {
  addLangAttribute,
  makeFocusable,
};