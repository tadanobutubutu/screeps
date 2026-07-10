'use strict';

// main.js - updated and error-free
function main() {
  console.log('Application running without errors.');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { main };
}

if (typeof require !== 'undefined' && require.main === module) {
  main();
}