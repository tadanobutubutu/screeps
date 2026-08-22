// Assuming 'htmlContent' is a variable that holds the HTML string for 'docs/dependency-graph.html'
const htmlContent = `
  <!-- Original HTML content up to line 185 -->
  <a id="unrotate" href="#">rotate back</a>
  <!-- Original HTML content after line 186 -->
`;

// Replace the <a> tag with a <button> tag
const updatedHtmlContent = htmlContent.replace(/<a id="unrotate" href="#">rotate back<\/a>/g, '<button id="unrotate">rotate back</button>');

// The updatedHtmlContent can now be used to update the file or inject into the DOM as needed
console.log(updatedHtmlContent);