// Original code
function myFunction() {
  // ... some code ...
}

// Conflicting changes from different branches
function myFunction() {
  // ... new code from branch HEAD ...
}

// Conflicting changes from another branch
function myFunction() {
  // ... new code from branch other-branch ...
}

// Resolved code
function myFunction() {
  // ... some code ...
  // ... new code from branch HEAD ...
  // ... new code from branch other-branch ...
}