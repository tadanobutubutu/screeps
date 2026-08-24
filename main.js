const someVar = require('some-module');
const someFunction = require('./some-file').someFunction;
module.exports.someFunction = someFunction;

// Re-exporting required functions from adjacent modules.
export { someFunction };

function init() {
    /* ... */
}
module.exports.init = init;

function newFunction() {
    // New function logic here
}
module.exports.newFunction = newFunction;

module.exports.loop = function() {
    // Placeholder logic for the Screeps loop
    console.log('Loop executed');
};