// No changes needed to main.js - this issue relates to HTML landmark accessibility in docs/index.html
// The fix should be applied directly to the HTML file by wrapping content in <main> tags

// Example of what the HTML fix should look like for docs/index.html:

/*
BEFORE:
<div class="container">
    <h2>Quality & Metrics Reports</h2>
    ...
</div>

AFTER:
<main>
    <div class="container">
        <h2>Quality & Metrics Reports</h2>
        ...
    </div>
</main>
*/

module.exports = {
  // ... existing code
};