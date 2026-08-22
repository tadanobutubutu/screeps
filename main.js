// TODO: Address accessibility issues from insight report:
// Below function adds an aria-label attribute to a given DOM element
function addAriaLabel(element) {
  if (typeof element === 'string') {
    // If the element is an ID, find the corresponding DOM element
    const domElement = document.getElementById(element);
    addAriaLabel(domElement);
  } else if (element.hasAttribute) {
    // If the element is a DOM object, add the aria-label attribute
    if (!element.getAttribute('aria-label')) {
      element.setAttribute('aria-label', 'Accessible label for the element');
    }
  }
}

// Let's find the example element and assign it to a variable
const exampleElement = document.getElementById('exampleElement');

// Call the newly added function for our example element
addAriaLabel(exampleElement);

// Existing code and export statements are preserved
// Avoid modifying them as per the rules