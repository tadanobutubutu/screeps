// Assuming main.js includes the HTML from 'docs/dependency-graph.html' dynamically

// Hypothetical function to update the lang attribute of the <html> tag
function setHtmlLangAttribute(lang) {
  const htmlTag = document.querySelector('html');
  if (htmlTag) {
    htmlTag.setAttribute('lang', lang);
  }
}

// Example usage of the function to set the language to English
setHtmlLangAttribute('en');