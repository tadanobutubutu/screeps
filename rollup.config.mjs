import { codecovRollupPlugin } from "@codecov/rollup-plugin";

export default {
  input: "main.js",
  output: {
    file: "dist/main.js",
    format: "cjs",
  },
  plugins: [
    // Put the Codecov rollup plugin after all other plugins
    codecovRollupPlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: "screeps-ai",
      uploadToken: process.env.CODECOV_TOKEN,
    }),
  ],
  // Screeps modules are resolved at runtime by the game engine, treat as external
  external: [
    "role.harvester",
    "role.upgrader",
    "role.builder",
    "role.repairer",
    "role.explorer",
    "role.medic",
    "role.transporter",
    "role.scout",
    "defense.manager",
    "utils.memory",
    "utils.logging",
    "utils.emotions",
    "memory.visualizer",
    "tutorial.auto",
    "gamification",
    "visual.effects",
    "auto.evolution",
    "system.adaptive",
    "utils.dashboard",
  ],
};
