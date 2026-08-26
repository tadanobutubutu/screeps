// TODO: Address accessibility issues from insight report: replace `my-button` with actual button id
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// [PLACE ALL EXISTING FUNCTIONS, VARIABLES, AND EXPORTS HERE]

// Modified line
const myButton = document.getElementById('actual-button-id');

// If myButton exists, let's make it accessible
if (myButton) {
  myButton.setAttribute('aria-label', 'Click the button');
}