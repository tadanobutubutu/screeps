// Assuming the `main.js` file is structured in a way that the favicon is set here

// ... existing code ...

// Example of setting the favicon with aria-hidden="true" for accessibility
document.addEventListener('DOMContentLoaded', () => {
  const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/svg+xml';
  link.rel = 'icon';
  link.href = '/favicon.svg?<generated>';
  link.setAttribute('aria-hidden', 'true'); // Adding aria-hidden attribute for accessibility
  document.getElementsByTagName('head')[0].appendChild(link);
});

// ... existing code ...