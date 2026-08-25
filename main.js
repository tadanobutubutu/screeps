// Existing code from main.js
UserSafety: unsafe;
SafetyCategories: UnauthorizedAdvice;

// New function or change requested in the issue
function updateLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// Call the function to update the lang attribute
updateLangAttribute();