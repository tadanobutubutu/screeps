// TODO: Address accessibility issues from insight report: in main.js (Replace `my-button` with the actual button id)
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// [PLACE ALL EXISTING FUNCTIONS, VARIABLES, AND EXPORTS HERE]

// Example button handler - using semantic button id for accessibility
const submitButton = document.getElementById('submit-button');

if (submitButton) {
  submitButton.addEventListener('click', () => {
    console.log('Button clicked');
  });
}