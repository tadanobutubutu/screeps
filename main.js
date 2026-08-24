// Existing code from main.js
// ... (Preserve all existing code, exports, and functions)

// New function to address language issue in HTML root element
function setHtmlLang() {
  const html = document.querySelector('html');
  if (html) {
    html.lang = 'en'; // Adjust the language as per your needs
  }
}

// New function to wrap content with <main>
function wrapContentWithMain() {
  const contentToWrap = document.querySelectorAll('html > body > .container, html > body > table');

  contentToWrap.forEach((element) => {
    const mainElement = document.createElement('main');
    mainElement.appendChild(element);
    element.parentNode.replaceChild(mainElement, element);
  });
}

// Call the functions to set lang and wrap the content in <main>
setHtmlLang();
wrapContentWithMain();

// ... (Preserve all existing code, exports, and functions)