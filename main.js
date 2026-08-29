// TODO: Add back any required exports that might have been?

// SYNCHRONOUS FUNCTION EXAMPLE
const exampleSynchronousFunction = (input) => input * 2;

// ASYNCHRONOUS FUNCTION EXAMPLE
const exampleAsyncFunction = async (input) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return input * 2;
};

// EXPORTS
module.exports = {
  exampleSynchronousFunction,
  exampleAsyncFunction,
};