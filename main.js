// Address NEW: Add aria-label
function addAriaLabel(element, label) {
  if (element) {
    element.setAttribute('aria-label', label);
  }
}

// Use the new function to add aria-labels to the appropriate elements
const myButton = document.querySelector('.my-button');
const myIcon = document.querySelector('.my-icon');

if (myButton) {
  addAriaLabel(myButton, 'My Button');
}

if (myIcon) {
  addAriaLabel(myIcon, 'My Icon');
}