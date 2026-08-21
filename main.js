// TODO: Add back any required exports that might have been?
// (This comment remains as-is)

// Ensure required exports are present
if (typeof module !== 'undefined' && typeof module.exports === 'object') {
  // Merge with newly added exports
  const newExports = {
    helper: require('./helper'),
    config: require('./config')
  };
  Object.assign(module.exports, newExports);
} else {
  // No existing exports, create new ones
  module.exports = {
    helper: require('./helper'),
    config: require('./config')
  };
}

function initialize() {
  // Existing initialization code
  return true;
}

module.exports.initialize = initialize;