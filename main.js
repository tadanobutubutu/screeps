// Original code
function myFunction() {
  // ... some code ...
  // ... new code from branch HEAD ...
  // ... new code from branch other-branch ...
}

// Conflicting changes from different branches
//<<<<<<< HEAD
// function myFunction() {
//   // ... new code from branch HEAD ...
// }

// Conflicting changes from another branch
//======= other-branch
// function myFunction() {
//   // ... new code from branch other-branch ...
// }

// Resolved code
//>>>>>>> other-branch