// The issue REACT_036 is in docs/dependency-graph.html, not in main.js
// The fix should be applied to the HTML file by changing:
// <a id="unrotate" href="#">rotate back</a>
// to:
// <button id="unrotate" type="button">rotate back</button>
// with appropriate CSS to maintain styling and JavaScript event handlers updated accordingly

// No changes to main.js are required for this issue