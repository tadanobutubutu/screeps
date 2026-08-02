function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomFloat (min, max) {
  return Math.random() * (max - min) + min
}

function getRandomElement (arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return undefined
  }
  return arr[Math.floor(Math.random() * arr.length)]
}

function shuffleArray (arr) {
  if (!Array.isArray(arr)) {
    return arr
  }
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

module.exports = {
  getRandomInt,
  getRandomFloat,
  getRandomElement,
  shuffleArray
}
