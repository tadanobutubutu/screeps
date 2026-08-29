// TODO: Implement a function to count dependencies
const countDependencies = (dependencies) => {
  if (!dependencies || typeof dependencies !== 'object') {
    return 0;
  }
  return Object.keys(dependencies).length;
};

module.exports = { countDependencies };