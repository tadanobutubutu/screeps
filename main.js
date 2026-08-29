// TODO: Existing code remains here
// TODO: Add back any required exports that might have been?
function main() {
  return "Hello, World!";
}

const version = "1.0.0";

const config = {
  port: 3000,
  debug: false
};

// TODO: Add any new functions or changes requested in the issue here
function getWelcomeMessage() {
  return main() + " This is a new function that returns a welcome message.";
}

export default main;
export { version, config, getWelcomeMessage };