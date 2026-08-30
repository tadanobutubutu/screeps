// main.js

function functionA(param) {
  return param * 2;
}

function functionB(param) {
  return param + 10;
}

function helper() {
  return "helper";
}

module.exports = {
  functionA,
  functionB,
  helper
};