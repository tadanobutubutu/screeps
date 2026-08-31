function divide(dividend, divisor) {
  if (typeof dividend !== 'number' || typeof divisor !== 'number') {
    throw new Error('Both arguments must be numbers.');
  }
  if (divisor === 0) {
    throw new Error('Cannot divide by zero.');
  }
  return dividend / divisor;
}