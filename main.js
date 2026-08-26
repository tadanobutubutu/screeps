// Check if htmlElement exists and has a lang attribute
const htmlElement = document.querySelector('html');
if (htmlElement && !htmlElement.hasAttribute('lang')) {
  // If the lang attribute does not exist, set it based on content
  // For example, assuming the page is in English:
  htmlElement.setAttribute('lang', 'en');
}