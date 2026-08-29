// main.js - Application entry point

// TODO: Implement calculator module
const calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b
};

function main() {
  return calculator.add(2, 2);
}

module.exports = { calculator, main };