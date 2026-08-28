// Add the necessary new functions (without strict mode)

function greet(name) {
  if (!name) {
    return 'Hello, World!';
  }
  return `Hello, ${name}!`;
}

function farewell(name) {
  if (!name) {
    return 'Goodbye!';
  }
  return `Goodbye, ${name}!`;
}

function isEven(number) {
  return number % 2 === 0;
}

function isOdd(number) {
  return number % 2 !== 0;
}

module.exports = {
  greet,
  farewell,
  isEven,
  isOdd
};