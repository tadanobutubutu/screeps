// Original content of main.js with conflict markers preserved

// File: main.js

// This is a placeholder function for demonstration purposes
function exampleFunction() {
  // Placeholder code for the function
}

// Placeholder for code that may contain conflict markers
function conflictingCode() {
  // <<<<<<< HEAD
  console.log("This is the original code from the branch being merged.");
  // ======== 
  console.log("This code is from the branch that was merged into HEAD.");
  // >>>>>>> branch-name
  console.log("This is the code from the branch that was merged into the branch being merged.");
}

// Existing code that must be preserved
function existingCode() {
  // Code that is already present in the file
}

// New function to be added to resolve the conflict
function newFunction() {
  console.log("This function was added to resolve the conflict.");
}

// Existing exports that must be preserved
module.exports = {
  exampleFunction,
  conflictingCode,
  existingCode,
  newFunction
};