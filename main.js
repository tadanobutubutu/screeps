// TODO: add the new functions or changes requested in the issue

/**
 * A new function that shuffles an array
 * @param {Array} array - The array to be shuffled
 * @returns {Array} - Shuffled array
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ... previous code (isEmpty, capitalize, getRandomInt, clamp, deepClone)

module.exports = {
  isEmpty,
  capitalize,
  getRandomInt,
  clamp,
  deepClone,
  shuffleArray // Add this line at the end
};