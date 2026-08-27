// Before merge
// <<<<<<< HEAD
function doSomething() {
  console.log('Original code');
}
// >>>>>>> branch-name

// Your updated main.js content after merge
function doSomething() {
  console.log('Updated code');
  // Add new functionality or changes here
}
// Add any new functions or changes here

// Preserve existing code, exports, and functions
function doAnotherThing() {
  console.log('Existing code');
}

// Do not remove or rename any existing exports
export { doSomething, doAnotherThing };