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

// TODO: This section is merged from both branches to address accessibility issues
// Keep existing code, exports, and functions from this point onwards
// Add your existing code, exports, functions here...

export const harvestLogic = () => {
  // Check user safety before harvesting
  const userSafetyMessage = checkUserSafety();
  
  // Check safety categories before harvesting
  const safetyCategoriesMessage = checkSafetyCategories();
  
  // Collect any warnings or issues
  const warnings = [];
  
  if (userSafetyMessage) {
    warnings.push(userSafetyMessage);
  }
  
  if (safetyCategoriesMessage) {
    warnings.push(safetyCategoriesMessage);
  }
  
  // Determine if harvest can proceed based on safety checks
  const canHarvest = warnings.length === 0;
  
  return {
    canHarvest,
    warnings,
    message: canHarvest 
      ? 'Harvest completed successfully.' 
      : 'Harvest aborted due to safety concerns. Please review warnings.'
  };
};