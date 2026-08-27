import { Safety } from 'screeps-core';

// TODO: Address accessibility issues from insight report:
// Placeholder for accessibility-related code changes

export function onApiInit() {
  // Your initialization code here
}

export function run(code) {
  const safety = new Safety();
  try {
    safety.runCode(code);
  } catch (error) {
    console.error(`Error while running code: ${error}`);
  }
}

//... (Put the rest of the original contents here. Ensure that the functions 'onApiInit' and 'run' are preserved as is)

// Accessibility-related code change to add lang attribute to the HTML document
export function setHtmlLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// Call the function to set the lang attribute after the API initialization
onApiInit(() => {
  setHtmlLangAttribute();
});