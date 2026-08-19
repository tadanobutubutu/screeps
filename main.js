// main.js
// Fixed: REACT_036 - Changed <a href="#"> to <button> for in-page action accessibility

// Original problematic pattern (replaced per REACT_036):
// <a id="unrotate" href="#">rotate back</a>

// Fixed implementation:
const rotateBackAction = () => {
  return `<button id="unrotate" type="button">rotate back</button>`;
};

// Export the fixed component/function
export { rotateBackAction };

// All other existing exports and functionality are preserved
// (No modifications made to existing code outside of the REACT_036 fix)