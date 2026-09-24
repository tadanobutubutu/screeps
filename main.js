// This is a simple greeting module
function greet (name) {
  return `Hello, ${name}!`
}

// New function to calculate the average of two numbers
module.exports.calculateAverage = function (a, b) {
  return (a + b) / 2
}

// Exported functions
module.exports.calculateSum = function (a, b) {
  return a + b
}
module.exports.calculateProduct = function (a, b) {
  return a * b
}

// Line 74 - Implement this function for creating in-page buttons
function createInPageButton (options) {
  const defaults = {
    text: 'Button',
    className: 'in-page-button',
    container: document.body,
    id: null,
    title: '',
    disabled: false
  }

// New function exampleFunction, as per the issue's request
function exampleFunction() {
    // Function implementation
    console.log("This is the new function exampleFunction");
}

// Add the new function to the exports
module.exports.exampleFunction = exampleFunction;