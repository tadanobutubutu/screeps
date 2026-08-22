// Assuming main.js contains a script tag that loads the HTML file
document.addEventListener('DOMContentLoaded', function() {
  // Your existing code...

  // Update the HTML file's <html> tag with the lang attribute
  const htmlTag = document.querySelector('html');
  if (htmlTag) {
    htmlTag.setAttribute('lang', 'en');
  }

  // Your existing code...
});