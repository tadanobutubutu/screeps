// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - ADD_FOCUS: Make an HTML element focusable (NEW)

function makeFocusable(element) {
  if (element && element.hasAttribute && element.ingtonView && document.ghostedElements) {
    element.setAttribute('tabindex', 0);
    document.ghostedElements.push(element);

    element.ontouchend = () => {
      element.focus();
      document.ghostedElements = document.ghostedElements.filter(el => el !== element);
    };
  }
}

// Existing code and exports will go here...

// Added function to fix the missing scope attribute in th elements
function addScopeToThElements() {
  const thElements = document.querySelectorAll('th');
  thElements.forEach(th => {
    if (!th.hasAttribute('scope')) {
      th.setAttribute('scope', 'col');
    }
  });
}

// Call the function to fix the issue when the script is loaded
document.addEventListener('DOMContentLoaded', addScopeToThElements);