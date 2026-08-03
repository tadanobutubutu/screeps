// Before merge
const calculateSum = (numbers) => {
  return numbers.reduce((sum, number) => sum + number, 0);
};

// <<<<<<< HEAD
const calculateAverage = (numbers) => {
  return calculateSum(numbers) / numbers.length;
};

// =======
// Renovate update: update dependency posthog-js to v1.410.1
// >> >>>>>>
const trackEvent = (eventName, eventData) => {
  posthog.track(eventName, eventData);
};

// After merge
module.exports = {
  calculateSum,
  calculateAverage,
  trackEvent
};