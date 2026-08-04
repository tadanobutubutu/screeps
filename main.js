export default {
  generateRandomNumber: function () {
    return Math.floor(Math.random() * 100)
  },
  testRandomGeneration: function () {
    const number = this.generateRandomNumber()
    return number >= 0 && number < 100
  }
}
