// Assuming there's a div with id 'my-div'
const myDiv = document.getElementById('my-div');

// To hide it from screen readers
myDiv.setAttribute('aria-hidden', true);

// You can also improve labels using HTML
const myButton = document.getElementById('my-button');
myButton.setAttribute('aria-label', 'A Button with special purpose');

// Add back any required exports that might have been
export function calculateSum(a, b) {
  return a + b;
}