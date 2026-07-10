function run() { // gr()
  if (__DEV__) {
    const gr = ...;
  }

  const currentGame = new Game();
  const creeps = currentGame.creeps;

  for (const name in creeps) {
    const creep = creeps[name];
    const role = creep.memory.role;

    switch (role) {
      case 'harvester':
        if (roleHarvester) {
          roleHarvester.run(creep);
        }
        break;
      case 'upgrader':
        if (roleUpgrader) {
          roleUpgrader.run(creep);
        }
        break;
      case 'builder':
        if (roleBuilder) {
          roleBuilder.run(creep);
        }
        break;
      case 'miner':
        if (roleMiner) {
          roleMiner.run(creep);
        }
        break;
      case 'mine':
        if (roleMine) {
          roleMine.run(creep);
        }
        break;
      case 'creep':
        if (roleCreep) {
          roleCreep.run(creep);
        }
        break;
      default:
        if (role && role !== 'undefined') {
          // Check if the role object has a name property that is itself a function
          if (role.name && typeof role.name === 'function') {
            role.name.run(creep);
          } else {
            console.log(`Unknown role: ${