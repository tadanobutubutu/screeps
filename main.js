// // TODO: Implement createInPageButton() and createAccessibleLink() functions here

function createInPageButton(options = {}) {
  const {
    id,
    text,
    onClick,
    className = '',
    ariaLabel,
    disabled = false
  } = options;

  const button = document.createElement('button');
  
  if (id) {
    button.id = id;
  }
  
  if (className) {
    button.className = className;
  }
  
  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }
  
  if (disabled) {
    button.disabled = true;
  }
  
  button.textContent = text || '';
  
  if (onClick && typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

function createAccessibleLink(options = {}) {
  const {
    id,
    href,
    text,
    onClick,
    className = '',
    ariaLabel,
    target = '_self',
    rel = 'noopener noreferrer',
    title
  } = options;

  const link = document.createElement('a');
  
  if (id) {
    link.id = id;
  }
  
  link.href = href || '#';
  
  if (className) {
    link.className = className;
  }
  
  if (ariaLabel) {
    link.setAttribute('aria-label', ariaLabel);
  }
  
  if (title) {
    link.title = title;
  }
  
  if (target && target !== '_self') {
    link.target = target;
    link.rel = rel;
  }
  
  link.textContent = text || '';
  
  if (onClick && typeof onClick === 'function') {
    link.addEventListener('click', (event) => {
      if (target === '_self' || target === '_blank') {
        // Allow default behavior for external links
      }
      onClick(event, link);
    });
  }
  
  return link;
}

// Example usage and export
module.exports = {
  createInPageButton,
  createAccessibleLink
};