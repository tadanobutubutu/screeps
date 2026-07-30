export function checkStatus() {
  return 'OK';
}

function sum(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new TypeError('Both arguments must be numbers');
    }
    return a + b;
}

module.exports = sum;
module.exports.checkStatus = checkStatus;
