// [Previous existing code remains unchanged]

// Add lang attribute to the HTML document
document.addEventListener('DOMContentLoaded', function() {
  // Select all th elements in the document
  const headers = document.querySelectorAll('th');

  headers.forEach(header => {
    // Check if the header already has a scope attribute
    if (!header.hasAttribute('scope')) {
      // Determine if it's a column or row header based on context
      if (header.closest('thead') || header.closest('tr:first-child')) {
        header.setAttribute('scope', 'col');
      } else if (header.closest('tr')) {
        header.setAttribute('scope', 'row');
      }
    }
  });

  // Set the lang attribute on the HTML element
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
});

// [Rest of existing code remains unchanged]