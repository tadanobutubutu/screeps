// TODO: Address accessible issues from insight report: in main.js

// Locate the button in the existing code
const myButton = document.querySelector('#myButton');

// Add an event listener to the button for accessibility purposes
myButton.addEventListener('click', function (event) {
  event.preventDefault(); // Prevent the default behavior of the button

  // Add your functionality here
  console.log('Button clicked');
});