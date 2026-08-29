// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

function addLangAttribute(lang) {
  if (lang && typeof lang === 'string') {
    document.documentElement.lang = lang;
  }
}

export { addLangAttribute };