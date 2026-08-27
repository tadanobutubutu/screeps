// Main application module

function createInPageButton(options = {}) {
  const button = document.createElement('button');
  button.textContent = options.text || 'Click me';
  button.className = options.className || 'in-page-button';
  button.disabled = options.disabled || false;
  button.setAttribute('aria-label', options.ariaLabel || options.text || 'Button');
  
  if (options.id) {
    button.id = options.id;
  }
  
  if (options.onClick) {
    button.addEventListener('click', options.onClick);
  }
  
  return button;
}

function createAccessibleLink(options = {}) {
  const link = document.createElement('a');
  link.textContent = options.text || 'Link';
  link.href = options.href || '#';
  link.className = options.className || 'accessible-link';
  
  if (options.id) {
    link.id = options.id;
  }
  
  link.setAttribute('aria-label', options.ariaLabel || options.text || 'Link');
  link.setAttribute('role', 'link');
  
  if (options.external) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  }
  
  if (options.tabIndex !== undefined) {
    link.tabIndex = options.tabIndex;
  }
  
  return link;
}

// Example usage
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app');
  
  const myButton = createInPageButton({
    text: 'Submit Form',
    className: 'btn-primary',
    onClick: () => console.log('Button clicked!')
  });
  
  const myLink = createAccessibleLink({
    text: 'Learn more about accessibility',
    href: 'https://example.com/accessibility',
    ariaLabel: 'Learn more about web accessibility',
    external: true
  });
  
  if (container) {
    container.appendChild(myButton);
    container.appendChild(myLink);
  }
});

module.exports = { createInPageButton, createAccessibleLink };