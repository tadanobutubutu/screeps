import { Safety } from 'screeps-core';

// TODO: Address accessibility issues from insight report:
// Placeholder for accessibility-related code changes

export function onApiInit() {
  // Your initialization code here
}

export function run(code) {
  const safety = new Safety();
  try {
    safety.runCode(code);
  } catch (error) {
    console.error(`Error while running code: ${error}`);
  }
}

//... (Put the rest of the original contents here. Ensure that the functions 'onApiInit' and 'run' are preserved as is)