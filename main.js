// Existing code and exports (preserved)

// New function or changes
function newFunction() {
  // Add new functionality here
}

// Add other changes requested in the issue if necessary

// End of new function or changes

function escapeString(str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
}