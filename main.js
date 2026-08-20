document.addEventListener('DOMContentLoaded', (event) => {
  const htmlTag = document.documentElement;
  if (!htmlTag.lang) {
    htmlTag.setAttribute('lang', 'en');
  }

  // Add main landmarks for accessibility (REACT_017)
  const mainElements = document.getElementsByTagName('main');
  if (mainElements.length === 0) {
    // Find the body content and wrap it in a main element
    const body = document.body;
    const main = document.createElement('main');
    while (body.firstChild) {
      main.appendChild(body.firstChild);
    }
    body.appendChild(main);
  }
});