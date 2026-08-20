// Assuming the main.js file contains the HTML content, here's how you would update it:
const mainContent = `
<div id="dependency-graph">
  <!-- Other content here -->
  <a class="unrotate" href="#">rotate back</a>
  <!-- Other content here -->
</div>
`;

// Now, if you need to use this content in your JavaScript, you can do so like this:
document.getElementById('dependency-graph').innerHTML = mainContent;