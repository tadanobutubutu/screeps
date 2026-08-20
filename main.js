'strict';

module.exports = function(context) {
  // This is a Screeps bot main file
  // The HEAD branch introduced a React component, but Screeps bots don't use React
  // The origin/main branch was a request for conflict resolution help, not actual code
  // We'll restore the expected Screeps bot structure

  console.log('Screeps bot starting up!');

  // Example creep logic
  const creep = Game.creeps['JohnDoe'];
  if (creep) {
    creep.moveTo(Game.flags.Spawn1);
  }
};