// Hypothetical existing code in main.js
export function loadContent() {
  // ... existing code to load content ...
}

export function saveContent() {
  // ... existing code to save content ...
}

export function updateUI() {
  // ... existing code to update UI ...
}

// Hypothetical conflict markers and changes
<<<<<<< HEAD
export function handleButtonClick() {
  // ... existing code for handling button click ...
}
=======

export function handleButtonClick() {
  // ... existing code for handling button click ...
  // Add accessibility improvement
  const button = document.querySelector('#myButton');
  if (button) {
    button.setAttribute('aria-label', 'Save content');
  }
}

>>>>>>> branch-name