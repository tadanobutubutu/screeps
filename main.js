// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// Fix language for the HTML root element

// Fix language for the HTML root element
document.documentElement.lang = 'en';

// Existing code from main.js
// ... (Preserve all existing code, exports, and functions)

function wrapContentWithMain() {
  const contentToWrap = document.querySelector('html > body > .container, html > body > table');

  if (contentToWrap) {
    const mainElement = document.createElement('main');
    mainElement.appendChild(contentToWrap);
    contentToWrap.parentNode.replaceChild(mainElement, contentToWrap);
  }
}

// Call the function to wrap the content in <main>
wrapContentWithMain();

// ... (Preserve all existing code, exports, and functions)