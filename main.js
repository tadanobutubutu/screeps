// Example of adding alt text to images
document.querySelectorAll('img').forEach(img => {
  if (!img.alt) {
    img.alt = 'Description of the image content';
  }
});

// Example of setting ARIA roles
document.querySelectorAll('.my-custom-element').forEach(element => {
  element.setAttribute('role', 'alert');
});

// Example of replacing non-semantic HTML with semantic HTML
document.querySelectorAll('.non-semantic-button').forEach(element => {
  const newButton = document.createElement('button');
  newButton.textContent = element.textContent;
  element.parentNode.replaceChild(newButton, element);
  newButton.classList.add('button-class');
});

// Example of fixing focus issues
document.querySelectorAll('.non-focusable').forEach(element => {
  element.setAttribute('tabindex', '-1');
});