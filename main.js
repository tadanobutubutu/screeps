const userSafety = 'unsafe';
const safetyCategories = 'Unauthorized Advice';

export const checkUserSafety = () => {
  let userSafetyMessage = '';

  if (userSafety !== 'safe') {
    userSafetyMessage = 'User safety level is set to "unsafe". Please review and update this setting for better security.';
  }

  return userSafetyMessage;
};

export const checkSafetyCategories = () => {
  let safetyCategoriesMessage = '';

  if (safetyCategories.includes('Unauthorized Advice')) {
    safetyCategoriesMessage = 'Safety categories contain unauthorized advice. Please review and update safety categories accordingly.';
  }

  return safetyCategoriesMessage;
};

export const createInPageButton = (options = {}) => {
  const {
    text = 'Button',
    onClick = null,
    className = 'in-page-button',
    id = null,
    disabled = false,
    type = 'button',
    ariaLabel = null,
    title = null
  } = options;

  const button = document.createElement('button');
  button.type = type;
  button.textContent = text;

  if (id) {
    button.id = id;
  }

  button.className = className;
  button.disabled = disabled;

  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }

  if (title) {
    button.title = title;
  }

  if (onClick && typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }

  return button;
};

// TODO: This section is merged from both branches to address accessibility issues
// Keep existing code, exports, and functions from this point onwards
// Add your existing code, exports, functions here...