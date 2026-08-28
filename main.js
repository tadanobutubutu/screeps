function makeFocusable(elem) {
  if (!elem.hasAttribute('tabindex')) {
    elem.setAttribute('tabindex', '0'); // This will make the div focusable
  }
}

// Use the function to make the div focusable
makeFocusable(document.querySelector('#myDiv'));