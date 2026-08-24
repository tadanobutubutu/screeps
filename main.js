// Could you please paste the contents of `main.js`, especially the sections with conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), so I can help resolve them?

// Fix for REACT_036 (docs/dependency-graph.html line 186):
// Replaced fake link `<a href="#">` with `<button>` for correct keyboard/screen-reader behavior.
const unrotateButton = '<button id="unrotate">rotate back</button>';
export { unrotateButton };