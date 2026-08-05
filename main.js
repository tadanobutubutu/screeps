// Original file content
function myFunction() {
  console.log('Original');
}

// Conflicting changes
function myFunction() {
  console.log('Updated');
}

// Resolved content
function myFunction() {
  // Choose which version you want to keep
  console.log('Updated');
}