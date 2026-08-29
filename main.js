function greet(name) {
  if (!name) {
    return "Hello, World!";
  }
  return `Hello, ${name}!`;
}

function calculateSum(numbers) {
  if (!Array.isArray(numbers)) {
    return 0;
  }
  return numbers.reduce((sum, num) => sum + num, 0);
}

function getTimestamp() {
  return new Date().toISOString();
}