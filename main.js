// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// Fix language for the HTML root element

(function() {
  // Set lang attribute on the HTML element for accessibility (REACT_015)
  var htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
})();