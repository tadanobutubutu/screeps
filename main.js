// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

export function addLangAttribute(lang = 'en') {
  const html = document.documentElement;
  if (html) {
    html.lang = lang;
  }
}

export function initAccessibility() {
  addLangAttribute();
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initAccessibility);
}