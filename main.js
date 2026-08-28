// Adding the new function
function processProperty(inputObject) {
  if (typeof inputObject !== 'object' || inputObject === null) {
    throw new TypeError('Input must be an object.');
  }

  // Assuming you want to double the value of the 'testProperty'
  if (inputObject.hasOwnProperty('testProperty')) {
    inputObject.testProperty *= 2;
  }

  return inputObject;
}

// Keeping the existing exports and functions as they are

module.exports = {
  //... existing exports
};