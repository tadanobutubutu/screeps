function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return undefined;
  }
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

module.exports = { getRandomInt, getRandomItem, getRandomFloat };