const UserSafety = 'unsafe';

function getSafetyCategory(userSafety, safetyCategories) {
  // Add your logic here to get the proper safety category based on userSafety and safetyCategories
  for (let category in safetyCategories) {
    if (userSafety === safetyCategories[category]) {
      return category;
    }
  }
  return 'Unauthorized Advice'; // Default safety category in case no match is found
}

module.exports = { getSafetyCategory };