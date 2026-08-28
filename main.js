// TODO: Add back any required exports that might have been?

function main() {
  return 'Hello World';
}

module.exports = {
  main,
  SomeClass,
  someUtility,
  config
};

function SomeClass() {}

function someUtility() {
  return true;
}

const config = {
  enabled: true
};