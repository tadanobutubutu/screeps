// calculate.js
export function calculateSum(numbers) {
  let total = 0;
  numbers.forEach(number => {
    total += number;
  });
  return total;
}