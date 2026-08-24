// Main JavaScript file for the Screeps bot

// React Landmarks issue (REACT_017) fix by adding <main> tag to docs/index.html
// as suggested in the comment above
// (Please find the suggested change in the comment section above)

// However, there's a need to address the issue shown by the conflict markers
// below, which could be related to the addition of new features or bug fixes.

// Collision detection and resolution logic for NPCs
function handleCollision(npc1, npc2) {
  // Check if both NPCs can be moved simultaneously
  if (npc1.canMove() && npc2.canMove()) {
    // If yes, resolve collision by choosing a new destination
    // for one of the NPCs based on the situation:
    // For example; prioritize CPU usage, required resources, or proximity.
    const choice = Math.random() < 0.3 ? npc1 : npc2;
    const newDest = chooseNewDestination(choice);
    choice.replan(newDest);
  } else {
    // If one or both NPCs cannot move, log an error and possibly take mitigation steps.
    console.error(`Collision detected between ${npc1.name} and ${npc2.name}.`);
  }
}

// Function to choose a new destination for an NPC, taking into account factors like CPU usage, required resources, or proximity.
function chooseNewDestination(npc) {
  // Example logic: Prioritize CPU usage
  const lowestCpuUsageSite = findSiteWithLowestCPUPercentage();
  return lowestCpuUsageSite.pos;
}

// Function to find the site with the lowest CPU percentage in the room
function findSiteWithLowestCPUPercentage() {
  let lowestCpuUsage = Infinity;
  let lowestCpuSite = null;

  for (const site of Game.spawns[SPAWN_NAME].room.find(FIND_MY_STRUCTURES, {
    filter: (structure) => structure.structureType === STRUCTURE_EXTENSION,
  })) {
    const cpuUsage = (site.energy * 100) / site.energyCapacity;
    if (cpuUsage < lowestCpuUsage) {
      lowestCpuUsage = cpuUsage;
      lowestCpuSite = site;
    }
  }

  return lowestCpuSite;
}