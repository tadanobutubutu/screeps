// TODO: Add back any required exports that might have been removed
// Here's an example of how to export a required function from another file:
const { someFunction } = require('./otherFile');
const { anotherFunction } = require('./anotherFile');
const { thirdFunction } = require('./thirdFile');

// Export the function so it's available to tests
module.exports = {
  someFunction,
  anotherFunction,
  thirdFunction
};