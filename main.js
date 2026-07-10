// main.js
'use strict';

function main() {
  // Application entry point
  return 'Hello World';
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { main };
}

if (typeof require !== 'undefined' && require.main === module) {
  main();
}