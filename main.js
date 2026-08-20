document.addEventListener('DOMContentLoaded', (event) => {
  const htmlTag = document.documentElement;
  if (!htmlTag.lang) {
    htmlTag.lang = 'en';
  }
});