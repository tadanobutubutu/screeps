// main.js
import { mergeConfig } from '@screeps/creep-manager';

// Require existing modules/files if needed
const creepsConfig = require('./creeps-config');
const spawningConfig = require('./spawning-config');
const terminalConfig = require('./terminal-config'); // Ensure this path is correct

// Merge configs safely
const creeping = mergeConfig(creepsConfig, input);
const spawning = mergeConfig(spawningConfig, creeping);
const terminal = mergeConfig(terminalConfig, spawning);

export const config = {
  ...creeping,
  ...spawning,
  ...terminal
};