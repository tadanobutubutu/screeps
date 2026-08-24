/* eslint-disable imported-modules, no-unused-vars */

let globalVariable = "I'm a global variable.";

const existingFunction = () => {
  console.log("This is an existing function.");
};

module.exports = {
  existingFunction,
  // New function added here
  initApp: () => {
    console.log("Initializing the app.");
  },
};

// Example usage of the new initApp function
module.exports.initApp();