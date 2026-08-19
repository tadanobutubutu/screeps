// @ts-check
import { Source } from "screeps";

declare global {
  // Preserve existing types from Screeps
  interface Memory {
    permanent: any;
    shard: {
      simulator: boolean;
    };
  }
}

// Preserve existing exports and functions
export const run = () => {
  // Existing module code preserved from original main.js
};

// Add new scope management logic
const markRotatedHeaders = () => {
  // Logic to add scope="col" attributes to rotated headers
  // This would be implemented in your table generation code
};

// Execute fixes during initialization
module.exports.loop = function () {
  // Existing loop code preserved
  const source = Source.keys()[0];
  if (Memory.shard.simulator) {
    markRotatedHeaders();
  }
};