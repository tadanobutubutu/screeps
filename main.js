/* The content below "<<<<<<< HEAD" is from your original code */

// Import the required module(s)
import mathUtils from 'math-utils';

// The new function that uses the imported module
function sumArray(numbers) {
  return numbers.reduce((a, b) => a + b);
}

// The existing code below "=======", if any

// The content above ">>>>>>> main-branch" is from the 'main' branch

// Add the new function as an export
export { sumArray };