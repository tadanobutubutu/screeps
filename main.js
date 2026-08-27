// main.js - Main module for dependency management

// Sample dependencies data
const dependencies = [
  { name: 'express', version: '4.18.2', dependents: 5 },
  { name: 'lodash', version: '4.17.21', dependents: 12 },
  { name: 'react', version: '18.2.0', dependents: 8 },
  { name: 'axios', version: '1.4.0', dependents: 3 },
];

// Function to get all dependencies
function getDependencies() {
  return dependencies;
}

// Function to get a dependency by name
function getDependency(name) {
  return dependencies.find(dep => dep.name === name);
}

// Function to count dependencies
function countDependencies() {
  return dependencies.length;
}

// Function to add a new dependency
function addDependency(name, version) {
  const newDep = { name, version, dependents: 0 };
  dependencies.push(newDep);
  return newDep;
}

module.exports = {
  getDependencies,
  getDependency,
  countDependencies,
  addDependency,
};