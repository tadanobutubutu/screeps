// In docs/dependency-graph.html, line 186:
// Change from:
//   <a id="unrotate" href="#">rotate back</a>
// To:
//   <button id="unrotate" type="button">rotate back</button>
//
// Also ensure any CSS that styled the <a> as a link is updated for the <button>,
// and any JavaScript click handler on #unrotate continues to work (button click
// events fire the same way as anchor click events).
//
// Example CSS adjustment to make the button look like the previous link:
//
//   #unrotate {
//     background: none;
//     border: none;
//     color: #0066cc;        /* link color */
//     cursor: pointer;
//     padding: 0;
//     font: inherit;
//     text-decoration: underline;
//   }
//
// The HTML change at line 186: