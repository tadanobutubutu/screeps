// main.js - Main application entry point
// This is a placeholder structure

const someFunction = () => {
  return 'Hello World';
};

const anotherFunction = (param) => {
  if (!param) {
    throw new Error('Parameter required');
  }
  return param * 2;
};

module.exports = {
  someFunction,
  anotherFunction
};