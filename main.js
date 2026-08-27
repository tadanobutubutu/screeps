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