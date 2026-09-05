import { dependencyGraphContent, indexContent } from './content';

function getLangAttribute() {
  // Get the language attribute from the document or default to 'en'
  const lang = document.documentElement.lang;
  return lang || document.querySelector('html').getAttribute('lang') || 'en';
}

function createInPageButton() {
  const lang = getLangAttribute();
  
  // Set the lang attribute on the HTML element
  document.documentElement.setAttribute('lang', lang);
  
  // Create the button element
  const button = document.createElement('button');
  button.textContent = 'In Page Button';
  button.setAttribute('type', 'button');
  
  return button;
}

// TODO: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())

export { dependencyGraphContent, indexContent, getLangAttribute, createInPageButton };