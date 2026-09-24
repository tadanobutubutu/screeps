// existing code and exports from main.js

// TODO: Implement this function for checking link and button accessibility
function checkAccessibility() {
  // Check if there are any links without alt text for images
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    if (link.rel === 'image') {
      const image = link.nextElementSibling;
      if (!image || !image.hasAttribute('alt')) {
        console.error('Accessibility issue: Image link without alt text', link);
      }
    }
  });

  // Check if there are any buttons without proper text
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.textContent.trim()) {
      console.error('Accessibility issue: Button without text', button);
    }
  });
}

// Existing code and exports from main.js continue below