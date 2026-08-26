// <<<<<<< HEAD
function greet(name) {
  return `Hello, ${name}!`;
}
// =======
function greet(name) {
  return `Hi, ${name}!`;
}
// >>>>>>> origin/main

function farewell(name) {
  return `Goodbye, ${name}!`;
}

module.exports = { greet, farewell };