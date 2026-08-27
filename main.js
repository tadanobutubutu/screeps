import { Safety } from 'screeps-core';

// TODO: Address accessibility issues from insight report:
// Accessibility-related changes implemented in table components

export function onApiInit() {
  // Your initialization code here
}

export function run(code) {
  const safety = new Safety();
  try {
    ...
  } catch (error) {
    console.error(`Error while running code: ${error}`);
  }
}