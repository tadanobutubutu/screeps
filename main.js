element.innerHTML = '<button id="unrotate">rotate back</button>';
// Accessibility improvement: replaced <a> with <button> for proper semantic HTML
// If you need to add click handler for the button:
// button.addEventListener('click', () => { /* rotation logic */ });

// Fix for multiple <main> landmarks issue (origin/main changes):
// 1. Ensure each <main> has a unique id attribute (e.g., main="#map", main=" spawn")
// 2. Remove duplicate <main> elements in the DOM structure
// 3. Verify landmarks are properly nested and do not conflict with other landmarks
// Example implementation:
// document.querySelectorAll('main').forEach((main, index) => {
//   if (index > 0) {
//     main.id = `main-${index}`;
//   }
// });
// Ensure only one <main> is present in the highest container for proper landmark hierarchy