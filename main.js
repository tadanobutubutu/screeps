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

  if (safetyCategories.includes('Authorized Advice')) {
    safetyCategoriesMessage = 'Safety categories contain unauthorized advice. Please review and update safety categories accordingly.';
  }

  return safetyCategoriesMessage;
};

// TODO: This section is merged from both branches to address accessibility issues
// Keep existing code, exports, and functions from this point onwards
// Add your existing code, exports, functions here...