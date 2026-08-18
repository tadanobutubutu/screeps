// main.js

// Function to generate table headers
function generateTableHeaders(headers) {
  return headers.map((header, index) => {
    // Assuming `header` is an object with `text` and `type` properties
    // `type` can be 'col' or 'row' to indicate the scope
    return `<th scope="${header.type}">${header.text}</th>`;
  }).join('');
}

// Sample function to handle the unrotate action
function unrotate() {
  // Logic to rotate back
  console.log('Rotating back...');
}

// Attach event listener when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const unrotateBtn = document.getElementById('unrotate');
  if (unrotateBtn) {
    unrotateBtn.addEventListener('click', unrotate);
  }
});

// Export for module usage if needed
module.exports = { unrotate, generateTableHeaders };
```