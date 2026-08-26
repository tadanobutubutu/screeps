// TODO: Add back any required exports that might have been removed
// Example of how to export a required function from another file
// const { myFunction } = require('./otherFile');
// module.exports = { myFunction };

const { add } = require('./calculator');
const { greet } = require('./utils');
const { calculateTotal } = require('./helpers');

module.exports = {
  add,
  greet,
  calculateTotal
};