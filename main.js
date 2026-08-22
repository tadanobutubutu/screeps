// TODO: Add back any required exports that might have been removed
// Here's an example of how to export a required function from another file:

function greet(name) {
  return `Hello, ${name}!`;
}

function getConfig() {
  return {
    apiUrl: 'https://api.example.com',
    timeout: 5000,
    retries: 3
  };
}

module.exports = {
  greet,
  getConfig
};