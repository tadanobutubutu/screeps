document.addEventListener('DOMContentLoaded', (event) => {
  const htmlTag = document.documentElement;
  if (!htmlTag.lang) {
    htmlTag.setAttribute('lang', 'en');
  }

  // New function to address the REACT_015 React Language Attribute issue
  function setLanguageAttribute() {
    const htmlTag = document.documentElement;
    if (!htmlTag.lang) {
      htmlTag.setAttribute('lang', 'en');
    }
  }

  // Call the function after the DOM content has loaded
  setLanguageAttribute();
});