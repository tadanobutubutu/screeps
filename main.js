// Assuming the main.js file is a configuration file for Jest or the application, which would likely contain the Jest setup.
module.exports = {
  // Existing Jest configuration
  // ...

  // Any other existing configurations or code
  // ...

  // Rule changes as requested for REACT_041 React SVG Accessible Name
  transformIgnorePatterns: [
    // ... any other patterns
    "/node_modules/(?!@react-icons)/",
    "/node_modules/(?!@material-ui)/",
    ".*\\.svg",
  ],

  // Any additional transformations for the new test cases if necessary
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": "babel-jest",
    // ... any other transformers
  },

  // New test cases could be added here, but as per the instructions, they must be separate files under /tests/
  // No changes should be made to the main.js file for new test cases

  // ... rest of the Jest configuration
  // ...
};