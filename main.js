// ... other code ...

// Before the change:
// <a id="unrotate" href="#">rotate back</a>

// After the change:
// <button id="unrotate" onClick={() => { /* logic to rotate back */ }}>rotate back</button>

// ... other code ...

// If the logic to rotate back is in a function, ensure it's exported and used in the onClick event:
// export function rotateBack() {
//   // Logic to rotate back
// }

// main.js
// ...