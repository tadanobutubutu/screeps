document.addEventListener('DOMContentLoaded', (event) => {
  const htmlTag = document.documentElement;
  if (!htmlTag.lang) {
    htmlTag.setAttribute('lang', 'en');
  }

  // Wrap the primary content in <main> for accessibility
  const primaryContent = document.querySelector('body > *');
  if (primaryContent) {
    primaryContent.insertAdjacentHTML('beforebegin', '<main></main>');
    primaryContent.insertAdjacentHTML('afterend', '</main>');
  }
});