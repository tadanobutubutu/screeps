// Existing code from main.js
// ...

// New function or changes requested in the issue
// Adding the lang attribute to the root HTML element
document.documentElement.lang = 'en';

// Ensure that the lang attribute is set on the root element
// This can be done by creating a script tag and appending it to the body
// or by modifying the existing <html> tag directly
if (document.querySelector('html').getAttribute('lang') === null) {
  const htmlLangAttribute = document.createElement('script');
  htmlLangAttribute.textContent = 'document.documentElement.lang = "en";';
  document.body.appendChild(htmlLangAttribute);
}

// Rest of the main.js content
// ...