// TODO: Add back any required exports that might have been?
const safetyConfig = {
  userSafety: 'unsafe',
  safetyCategories: 'Unauthorized Advice'
};

function getSafetyConfig() {
  return safetyConfig;
}

function validateSafetyInput(input) {
  if (typeof input !== 'string') {
    return false;
  }
  return input.length > 0;
}

module.exports = {
  safetyConfig,
  getSafetyConfig,
  validateSafetyInput
};