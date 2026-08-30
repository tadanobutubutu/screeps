const createResourceButton = (url, title, icon) => {
  const btn = document.createElement('a');
  btn.href = url;
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';

  const iconContainer = document.createElement('span');
  iconContainer.className = 'resource-icon';
  iconContainer.innerHTML = icon;

  const titleContainer = document.createElement('span');
  titleContainer.className = 'resource-title';
  titleContainer.textContent = title;

  btn.appendChild(iconContainer);
  btn.appendChild(titleContainer);
  btn.setAttribute('aria-label', `Open ${title} in a new tab`);

  return btn;
};

// Existing code that needs to be preserved
// ...

module.exports = {
  // Existing exports that need to be preserved
  // ...

  createResourceButton, // NEW export for the utility function
};