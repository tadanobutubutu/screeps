// Conflict resolution - keeping HEAD version
function function1() {
  return 'Hello from function1';
}

function function2(param) {
  return param * 2;
}

// TODO: Implement new function3 logic here
function function3() {
  return 'function3 implemented';
}

module.exports = {
  function1,
  function2,
  function3
};