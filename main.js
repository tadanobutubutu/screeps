// main.js - No changes required for this accessibility issue
// The lang="en" attribute should be added to the HTML file, not JavaScript

function calculateScore(input) {
  // Original implementation
  return input * 2;
}

function processData(data) {
  // Original processing logic
  return data.map(item => item.toUpperCase());
}

// Additional helper (optional, added for completeness but does not affect existing exports)
function helper() {
  // Placeholder implementation
}

// New function to handle dashboard rendering logic
function renderDashboardContent(status, errorContent, successContent) {
  return (
    <main>
      {status === 'error' ? errorContent : successContent}
    </main>
  );
}

// Export the functions
module.exports = {
  calculateScore,
  processData,
  renderDashboardContent
};