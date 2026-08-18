// main.js - resolved conflicts (preserving all original code and exports)

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

// Exported functions – keep the original exports unchanged
export { calculateScore, processData };

// New function to handle dashboard rendering logic
function renderDashboardContent(status, errorContent, successContent) {
  return (
    <main>
      {status === 'error' ? errorContent : successContent}
    </main>
  );
}

// Export the new function
export { renderDashboardContent };